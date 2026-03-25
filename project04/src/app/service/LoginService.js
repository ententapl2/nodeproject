import bcrypt from "bcrypt";
import InvalidInputError from "../error/InvalidInputError.js";
import NotFoundError from "../error/NotFoundError.js";

export default class LoginService {

    #userQueryRepo;

    constructor(userQueryRepo) {
        this.#userQueryRepo = userQueryRepo;
    }

    async login(username, password) {
        const user = this.#userQueryRepo.getAuthUserQuery(username);
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) throw new InvalidInputError('Niepoprawne hasło'); 
            else return user;
        } else {
            throw new NotFoundError('Użytkownik nie istnieje');
        }

    }

}