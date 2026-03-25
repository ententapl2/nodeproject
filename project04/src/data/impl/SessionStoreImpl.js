import session from "express-session";

export default class SessionStoreImpl extends session.Store {

    #DB;

    constructor(db) {
        super();
        this.#DB = db;
    }

    get(sid, callback) {
        try {
            const sql = `
            SELECT 
                userSession.data AS [userSession.data]
            FROM 
                userSession 
            WHERE 
                userSession.id = :id AND
                (userSession.expires IS NULL OR userSession.expires > unixepoch());
            `;
            const query = this.#DB.query(sql, {id: sid});
            if (query.length > 0) {
                const session = JSON.parse(query[0]['userSession.data']);
                callback(null, session);
            } else callback(null, null);

        } catch (err) {
            callback(err);
        }
    }

    set(sid, sessionData, callback) {
        try {
            const expires = sessionData.cookie?.expires  
                ? new Date(sessionData.cookie.expires).getTime() / 1000 
                : null;
            const data = JSON.stringify(sessionData);
            const sql = `
            INSERT INTO userSession(
                id, 
                userId, 
                data,
                expires 
            ) VALUES (
                :id, 
                :userId, 
                :data, 
                :expires 
            ) 
            ON CONFLICT(id) DO UPDATE SET 
                data = excluded.data, 
                expires = excluded.expires, 
                userId = excluded.userId;
            `;
            this.#DB.execute(sql, {
                id: sid,
                userId: (sessionData.userId || null), 
                data: data, 
                expires: expires
            });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }

    destroy(sid, callback) {
        try {
            const sql = `
            DELETE 
            FROM 
                userSession 
            WHERE 
                userSession.id = :id;
            `;
            this.#DB.execute(sql, {
                id: sid
            });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }

    touch(sid, sessionData, callback) {
        try {
            const expires = sessionData.cookie?.expires  
                ? new Date(sessionData.cookie.expires).getTime() / 1000 
                : null;
            const sql = `
            UPDATE userSession 
            SET 
                expires = :expires 
            WHERE 
                userSession.id = :id;
            `;
            this.#DB.execute(sql, {
                expires: expires,
                id: sid
            });
            callback(null);
        } catch (err) {
            callback(err);
        }
    }

}