import UnitOfWork from "../../app/service/UnitOfWork.js";

export default class UnitOfWorkImpl extends UnitOfWork {

    #DB;

    constructor(db) {
        super();
        this.#DB = db;
    }

    executeTransaction(work) {
        this.#DB.execute('BEGIN TRANSACTION;');
        try {
            const func = work();
            this.#DB.execute('COMMIT;');
            return func;
        } catch (e) {
            this.#DB.execute('ROLLBACK;');
            throw e;
        }
    }
    
}