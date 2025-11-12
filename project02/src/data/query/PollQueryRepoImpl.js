import PollQueryRepo from "../../app/query/PollQueryRepo.js";
import PollQueryMapper from "../mapper/PollQueryMapper.js";

export default class PollQueryRepoImpl extends PollQueryRepo {

    #DB;

    constructor(db) {
        super();
        this.#DB = db;
    }

    getPoll(pollId, votesLimit=10, votesOffset=0) {
        const pollSql = `
        SELECT 
            poll.id AS [poll.id],
            poll.question AS [poll.question],
            poll.description AS [poll.description],
            user.id AS [author.id],
            user.name AS [author.name],
            poll.publicationDate AS [poll.publicationDate], 
            option.id AS [option.id], 
            option.name AS [option.name] 
        FROM 
            poll 
        LEFT JOIN user ON user.id = poll.authorId 
        LEFT JOIN option ON option.pollId = poll.id 
        WHERE 
            poll.id = :id;
        `
        const votesSql = `
        SELECT 
            vote.pollId AS [vote.pollId], 
            user.id AS [user.id],
            user.name AS [user.name],
            vote.optionId AS [vote.optionId],
            vote.publicationDate AS [vote.publicationDate] 
        FROM 
            vote 
        JOIN user ON user.id = vote.userId 
        WHERE 
            vote.pollId = :pollId 
        LIMIT :limit 
        OFFSET :offset;
        `

        const pollQuery = this.#DB.query(pollSql, {
            id:pollId
        });
        const votesQuery = this.#DB.query(votesSql, {
            pollId: pollId,
            limit:votesLimit,
            offset:votesOffset
        });
        return PollQueryMapper.pollEntityToPoll(pollQuery, votesQuery);


    }

    getPollsSummaryByLatestDate(limit=10, offest=0) {
        const sql = `
        SELECT 
            poll.id AS [poll.id], 
            poll.question AS [poll.question],
            poll.description AS [poll.description],
            user.id AS [author.id], 
            user.name AS [author.name], 
            poll.publicationDate AS [poll.publicationDate],
            option.id AS [option.id],
            option.name AS [option.name] 
        FROM (
            SELECT 
                poll.id 
            FROM 
                poll 
            ORDER BY 
                poll.publicationDate 
            DESC    
            LIMIT :limit 
            OFFSET :offset 
        ) AS latestPoll 
            
        JOIN poll ON poll.id = latestPoll.id 
        LEFT JOIN user ON user.id = poll.authorId 
        LEFT JOIN option ON option.pollId = poll.id;
        `
        const query = this.#DB.query(sql, {
            limit:limit,
            offset:offest
        });
        return PollQueryMapper.pollEntitiestoPollsSummary(query);
    }

    getPollsSummaryByMostVotes(limit=10, offset=0) {
        const sql = `
        SELECT 
            poll.id AS [poll.id], 
            poll.question AS [poll.question],
            poll.description AS [poll.description],
            user.id AS [author.id],
            user.name AS [author.name],
            poll.publicationDate AS [poll.publicationDate],
            option.id AS [option.id],
            option.name AS [option.name] 
        FROM 
            (
            SELECT 
                poll.id 
            FROM  
                poll 
            LEFT JOIN vote ON vote.pollId = poll.Id  
            GROUP BY 
                poll.id 
            ORDER BY 
                COUNT(vote.userId) 
            DESC 
            LIMIT :limit 
            OFFSET :offset 
        ) AS latestPoll 
         
        JOIN poll ON poll.id = latestPoll.id
        LEFT JOIN user ON user.id = poll.authorId 
        LEFT JOIN option ON option.pollId = poll.id;
        `
        const query = this.#DB.query(sql, {
            limit:limit,
            offset:offset
        });
        return PollQueryMapper.pollEntitiestoPollsSummary(query);
    }

    getPollsSummary(userId, limit=10, offset=0) {
        const sql = `
        SELECT 
            poll.id AS [poll.id], 
            poll.question AS [poll.question],
            poll.description AS [poll.description],
            user.id AS [author.id], 
            user.name AS [author.name], 
            poll.publicationDate AS [poll.publicationDate],
            option.id AS [option.id],
            option.name AS [option.name] 
        FROM (
            SELECT 
                poll.id 
            FROM 
                poll
            WHERE 
                poll.authorId = :authorId  
            ORDER BY 
                poll.publicationDate 
            DESC 
            LIMIT :limit 
            OFFSET :offset 
        ) AS userPoll 
            
        JOIN poll ON poll.id = userPoll.id 
        LEFT JOIN user ON user.id = poll.authorId 
        LEFT JOIN option ON option.pollId = poll.id;
        `
        const query = this.#DB.query(sql, {
            authorId: userId,
            limit: limit,
            offset:offset
        });
        return PollQueryMapper.pollEntitiestoPollsSummary(query);
    }

}