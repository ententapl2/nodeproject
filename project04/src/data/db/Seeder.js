import bcrypt from "bcrypt";

export default class Seeder {

    #DB;

    constructor(db) {
        this.#DB = db;
    }

    seedRoles(roles) {
        const sql = `
        INSERT OR IGNORE INTO role(
            id, 
            name
        ) VALUES (
            :id, 
            :name
        );
        `;
        roles.map(role => this.#DB.execute(sql, {
            id: role.id,
            name: role.name   
        }));

    }

    async seedUsers(users) {
        const sql = `
        INSERT OR IGNORE INTO user(
            name, 
            password
        ) VALUES (
            :name, 
            :password
        );
        `;
        const sql2 = `
        INSERT OR IGNORE INTO userRole(
            userId, 
            roleId
        ) VALUES (
            :userId, 
            :roleId 
        );
        `;

        for (const user of users) {
            const userId = this.#DB.execute(sql, {
                name: user.name, 
                password: await bcrypt.hash(user.password, 10)
            });
            userId && user.roles.map(role => {
                this.#DB.execute(sql2, {
                    userId: userId,
                    roleId: role.id
                });
            });
        }
    }


}