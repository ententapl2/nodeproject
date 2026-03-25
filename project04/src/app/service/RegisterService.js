import User from "../../domain/model/User.js";
import bcyrpt from "bcrypt";
import ConflictError from "../error/ConflictError.js";
import ApplicationError from "../error/ApplicationError.js";

export default class RegisterService {

    #userRepo;
    #userQueryRepo;

    constructor(userRepo, userQueryRepo) {
        this.#userRepo = userRepo;
        this.#userQueryRepo = userQueryRepo;
    }

    async register(username, password) {
        const hash = await bcyrpt.hash(password, 10);
        const user = new User(
            null,
            username,
            hash
        );
        const users = this.#userQueryRepo.getUserByName(username);
        if (users.length !== 0) throw new ConflictError('Użytkownik o tej samej nazwie już istnieje');
        
        try {
            this.#userRepo.addUser(user);
            return this.#userQueryRepo.getUserByName(username);
        } catch (e) {
            throw new ApplicationError('Błąd przy tworzeniu użytkownika');
        }
    };

}