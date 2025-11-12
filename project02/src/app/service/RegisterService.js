import User from "../../domain/model/User.js";
import bcyrpt from "bcrypt";

export default class RegisterService {

    #userRepo;
    #userQueryRepo;

    constructor(userRepo, userQueryRepo) {
        this.#userRepo = userRepo;
        this.#userQueryRepo = userQueryRepo;
    }

    async register(username, password) {
        const hash = await bcyrpt.hash(password, 10) // sól 10krotna jest chyba dość słona
        const user = new User(
            null,
            username,
            hash
        );
        const users = this.#userQueryRepo.getUserByName(username);
        if (users.length !== 0) {
            throw {
                type:1,
                message:'User with same name already exists'
            };
        }
        try {
            this.#userRepo.addUser(user);
            return this.#userQueryRepo.getUserByName(username);
        } catch (e) {
            throw {
                type:2,
                message:'Error while registering user'
            };
        }
    };

}