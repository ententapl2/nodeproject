import PollRepo from "../../domain/repo/PollRepo.js";

export default class PollRepoImpl extends PollRepo {

    #DB;

    constructor(db) {
        super();
        this.#DB = db;
    }

    addPoll(poll) {
        const sql = `
        INSERT INTO poll(
            id,
            question,
            description,
            authorId,
            publicationDate
        ) VALUES (
            :id,
            :question,
            :description,
            :authorId,
            :publicationDate 
        );
        `
        return this.#DB.execute(sql, {
            id: poll.id,
            question: poll.name,
            description: poll.description,
            authorId: poll.author.id,
            publicationDate: poll.publicationDate
        });
    }

    deletePoll(pollId) {
        const sql = `
        DELETE 
        FROM 
            poll 
        WHERE 
            poll.id = :id
        `
        this.#DB.execute(sql, {
            id: pollId
        });

    }

    modifyPoll(poll) {
        const sql = `
        UPDATE poll 
        SET 
            question = :question,
            description = :description,
            authorId = :authorId, 
            publicationDate = :publicationDate
        WHERE 
            poll.id = :id;
        `
        this.#DB.execute(sql, {
            id: poll.id,
            question: poll.name,
            description: poll.description,
            authorId: poll.author.id,
            publicationDate: poll.publicationDate
        });
    }

    addOption(pollId, optionName) {
        const sql = `
        INSERT INTO option(
            id, 
            pollId,
            name
        ) VALUES(
            :id,
            :pollId,
            :name
        );
        `
        this.#DB.execute(sql, {
            id:null,
            pollId:pollId,
            name: optionName
        });
    }

    modifyOption(optionId, optionName, pollId) {
        const sql = `
        UPDATE option 
        SET 
            name = :optionName 
        WHERE 
            option.id = :id AND 
            option.pollId = :pollId 
        `
        this.#DB.execute(sql, {
            id: optionId,
            optionName: optionName,
            pollId: pollId
        });
    }

    deleteOption(optionId) {
        const sql = `
        DELETE 
        FROM 
            option  
        WHERE 
            option.id = :id
        `
        this.#DB.execute(sql, {
            id: optionId
        });  
    }

    addVote(pollId, userId, optionId) {
        const sql = `
        INSERT INTO vote(
            pollId, 
            userId, 
            optionId, 
            publicationDate
        ) VALUES (
            :pollId,
            :userId,
            :optionId,
            strftime('%s', 'now')
        );
        `
        this.#DB.execute(sql, {
            pollId:pollId,
            userId:userId,
            optionId:optionId
        });
    }


}