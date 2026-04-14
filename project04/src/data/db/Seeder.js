import { randomInt } from "crypto";
import argon2 from "argon2";

export default class Seeder {

    #DB;
    #pepper;

    constructor(db, pepper) {
        this.#DB = db;
        this.#pepper = pepper;
    }

    seedPasword(len = 16) {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const nums = "0123456789";
        const all = upper + lower + nums;

        let p = [
            upper[randomInt(upper.length)],
            lower[randomInt(lower.length)],
            nums[randomInt(nums.length)],
        ];

        while (p.length < len) {
            p.push(all[randomInt(all.length)]);
        }

        return p.sort(() => randomInt(3) - 1).join("");
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
            user.password = user.password ?? this.seedPasword();
            const userId = this.#DB.execute(sql, {
                name: user.name, 
                password: await argon2.hash(user.password, {secret: Buffer.from(this.#pepper, "hex")})
            });
            if (userId) {
                console.log(`Losowe wygenerowane hasło dla konta o nazwie ${user.name} to: ${user.password} \n`);
                user.roles.map(role => {
                    this.#DB.execute(sql2, {
                        userId: userId,
                        roleId: role.id
                    });
                });
            }
        }
    }
 
}