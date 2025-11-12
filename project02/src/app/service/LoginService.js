import bcrypt from "bcrypt";

export default class LoginService {

    #userQueryRepo;

    constructor(userQueryRepo) {
        this.#userQueryRepo = userQueryRepo;
    }

    async login(username, password) {
        const user = this.#userQueryRepo.getAuthUserQuery(username);
        if (user.length !== 0) {
            const match = await bcrypt.compare(password, user[0].password);
            if (!match) {
                throw {
                    type:1,
                    message:'Niepoprawne hasło'
                }
            } else return user;
        } else {
            throw {
                type:2,
                message:'Użytkownik nie istnieje'
            }
        }

    }

}