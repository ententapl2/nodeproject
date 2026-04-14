import bcrypt from "bcrypt";
import argon2 from "argon2";

import User from "../../domain/model/User.js";
import InvalidInputError from "../error/InvalidInputError.js";
import NotFoundError from "../error/NotFoundError.js";
import ConflictError from "../error/ConflictError.js";
import ApplicationError from "../error/ApplicationError.js";

export default class AuthService {

    #userRepo;
    #userQueryRepo;
    #pepper;

    async #migratePassword(userQuery, password) {
        const hash = await argon2.hash(password, {secret: Buffer.from(this.#pepper, "hex")});
        const user = new User(
            userQuery.id, 
            userQuery.name,
            hash
        );
        await this.#userRepo.modifyUser(user);
    }
    
    #validate(username, password) {
        let errors = [];
        if (!username || !password) {
            errors.push('Nieprawidłowe dane wejściowe');
            return errors;
        };
        if (username.length < 3 || username.length > 20) errors.push('Nazwa użytkownika musi miec od trzech do 20 znaków');
        if (password.length < 12 || password.length > 50) errors.push('Hasło musi mieć od 12 znaków do 50');
        if (!/[A-Z]/.test(password)) errors.push('Hasło musi zawierać jeden duży znak');
        if (/\s/g.test(username)) errors.push('Nazwa użytkownika nie może mieć spacji');
        if (/\s/g.test(password)) errors.push('Hasło nie może mieć spacji');
        return errors;     
    }

    constructor(userRepo, userQueryRepo, pepper) {
        this.#userRepo = userRepo;
        this.#userQueryRepo = userQueryRepo;
        this.#pepper = pepper;
    }

    async login(username, password) {

        const validation = this.#validate(username, password);
        if (validation.length !== 0 ) throw new InvalidInputError('Nieprawidłowe dane wejściowe', validation);

        const user = this.#userQueryRepo.getAuthUserQuery(username);
        if (user) {
            const match = await user.password.startsWith('$2') 
                ? bcrypt.compare(password, user.password) 
                : argon2.verify(user.password, password, {secret: Buffer.from(this.#pepper, "hex")});
            user.password.startsWith('$2') && this.#migratePassword(user, password);

            validation.push('Nieprawidłowe hasło');
            if (!match) throw new InvalidInputError('Niepoprawne dane wejściowe', validation); 
            else return user;
        } else {
            validation.push('Użytkownik o takiej nazwie nie istnieje');
            throw new NotFoundError('Użytkownik nie istnieje', validation);
        }

    }

    async register(username, password) {
        const validation = this.#validate(username, password);
        if (validation.length !== 0) throw new InvalidInputError('Nieprawidłowe dane wejściowe', validation);

        const hash = await argon2.hash(password, {secret: Buffer.from(this.#pepper, "hex")});
        const user = new User(
            null,
            username,
            hash
        );
        const users = this.#userQueryRepo.getUserByName(username);
        if (users.length !== 0) throw new ConflictError('Konflikt danych', ['Użytkownik o tej samej nazwie już istnieje']);
        
        try {
            this.#userRepo.addUser(user);
            return this.#userQueryRepo.getUserByName(username);
        } catch (e) {
            throw new ApplicationError('Błąd wewnętrzny', ['Błąd przy tworzeniu użytkownika']);
        }
    };

}