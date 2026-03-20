import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default class Database {

    #db;

    #constructDb(dbName) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const dbPath = path.join(__dirname, dbName);
        const buildPath = path.join(__dirname, 'constructDb.sql');

        this.#db = new DatabaseSync(dbPath);
        let quries =  fs.readFileSync(buildPath, {
            encoding: 'utf8',
            flag: 'r'
        });

        try {
            this.#db.exec(quries);
        } catch (err) {
            console.log(`Błąd w odczycie danych: ${err}`);
        }

    }

    constructor(dbPath) {
        this.#constructDb(dbPath);
    }

    execute(sql, values={}) {
        const stmt = this.#db.prepare(sql);
        const info = stmt.run(values);
        return info?.lastInsertRowid;
    }

    query(sql, params={}) {
        const query = this.#db.prepare(sql).all(params);
        return query
    }


}