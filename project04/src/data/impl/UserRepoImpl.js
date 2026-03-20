import UserRepo from "../../domain/repo/UserRepo.js";

export default class UserRepoImpl extends UserRepo {

    #DB;

    constructor(db) {
        super();
        this.#DB = db;
    }

    addUser(user) {
        const sql = `
        INSERT INTO user(
            id, 
            name, 
            password
        ) VALUES (
            :id,
            :name,
            :password
        );
        `
        this.#DB.execute(sql, {
            id:user.id,
            name:user.name,
            password:user.password
        });
    }

    deleteUser(userId) {
        const sql = `
        DELETE 
        FROM 
            user
        WHERE 
            id = :id
        `
        this.#DB.execute(sql, {
            id: userId
        });

    }

    modifyUser(user) {
        const sql = `
        UPDATE user 
        SET 
            name = :name,
            password = :password
        WHERE 
            user.id = :id; 
        `
        this.#DB.execute(sql, {
            id: user.id,
            name: user.name,
            password: user.password
        });
    }



}