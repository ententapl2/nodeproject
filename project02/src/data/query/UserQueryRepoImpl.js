import UserQueryRepo from "../../app/query/UserQueryRepo.js";
import UserQueryMapper from "../mapper/UserQueryMapper.js";

export default class UserQueryRepoImpl extends UserQueryRepo {

    #DB;
    
    constructor(db) {
        super();
        this.#DB = db;
    }

    getUser(userId) {
        const sql = `
        SELECT 
            user.id AS [user.id], 
            user.name AS [user.name] 
        FROM 
            user 
        WHERE 
            user.id = :id;
        `
        const query = this.#DB.query(sql, {
            id:userId
        });
        return UserQueryMapper.userEntitiesToUser(query)[0] ?? null;

    }

    getUserByName(name) {
        const sql = `
        SELECT 
            user.id AS [user.id], 
            user.name AS [user.name] 
        FROM 
            user 
        WHERE 
            user.name = :name;
        `
        const query = this.#DB.query(sql, {
            name:name
        });
        return UserQueryMapper.userEntitiesToUser(query);
    }

    getUsersByMostVotes(limit=10, offset=0) {
        const sql = `
        SELECT 
            user.id AS [user.id], 
            user.name AS [user.name] 
        FROM 
            user 
        LEFT JOIN vote ON vote.userId = user.id 
        GROUP BY 
            user.id 
        ORDER BY 
            COUNT(vote.userId) 
        DESC 
        LIMIT :limit 
        OFFSET :offset;
        `
        const query = this.#DB.query(sql, {
            limit:limit,
            offset:offset
        });
        return UserQueryMapper.userEntitiesToUser(query);

    }

    getUsersByMostPolls(limit=10, offset=0) {
        const sql = `
        SELECT 
            user.id AS [user.id],
            user.name AS [user.name]
        FROM 
            user 
        LEFT JOIN poll ON poll.authorId = user.id 
        GROUP BY 
            user.id 
        ORDER BY 
            COUNT(poll.id) 
        DESC 
        LIMIT :limit 
        OFFSET :offset;
        `
        const query = this.#DB.query(sql, {
            limit:limit,
            offset:offset
        });
        return UserQueryMapper.userEntitiesToUser(query);
    }

    getAuthUserQuery(name) {
        const sql = `
        SELECT 
            user.id AS [user.id], 
            user.name AS [user.name],
            user.password AS [user.password] 
        FROM 
            user 
        WHERE 
            user.name = :name;
        `
        const query = this.#DB.query(sql, {
            name:name
        });
        return UserQueryMapper.userEntitiesToAuthUser(query);
    }

    getUserStatsQuery(userId) {
        const sql = `
        SELECT
            user.id AS [user.id],
            user.name AS [user.name],
            (
                SELECT COUNT(*) 
                FROM vote
                WHERE vote.userId = user.id
            ) AS [stat.voteCount],
            (
                SELECT COUNT(*) 
                FROM poll
                WHERE poll.authorId = user.id
            ) AS [stat.pollCount]
        FROM 
            user
        WHERE 
            user.id = :id;

        `
        const query = this.#DB.query(sql, {
            id:userId
        });
        return UserQueryMapper.userEntitesToUserStats(query)[0] ?? null;
    }


}