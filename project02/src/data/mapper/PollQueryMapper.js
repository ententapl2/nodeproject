import PollSummaryQuery from "../../app/queryDto/PollSummaryQuery.js";
import UserQuery from "../../app/queryDto/UserQuery.js";
import PollQuery from "../../app/queryDto/PollQuery.js";

export default class PollQueryMapper {

    static votesEntitiesToObjects(votesQuery) {

        const votes = {};
        for (const vote of votesQuery) {
            const optionId = vote['vote.optionId'];
            if (!votes[optionId]) votes[optionId] = [];
            votes[optionId].push({
                user: new UserQuery(vote['user.id'], vote['user.name']),
                publicationDate: new Date(vote['vote.publicationDate']).toLocaleDateString()
            });
        }

        return votes;

    }

    static pollEntityToPoll(pollQuery, votesQuery) {

        return pollQuery.length !== 0 ? new PollQuery(
            pollQuery[0]['poll.id'],
            pollQuery[0]['poll.question'],
            pollQuery[0]['poll.description'],
            new UserQuery(
                pollQuery[0]['author.id'],
                pollQuery[0]['author.name']
            ),
            new Date(pollQuery[0]['poll.publicationDate']).toLocaleDateString(),
            pollQuery.map(o => ({
                id: o['option.id'],
                name: o['option.name']
            })),
            PollQueryMapper.votesEntitiesToObjects(votesQuery)
        ) : null;

    }

    static pollEntitiestoPollsSummary(query) {
        
        const polls = {};
        for (const row of query) {
            const pollId = row['poll.id'];
            const optionId = row['option.id'];
            const optionName = row['option.name'];

            if (!polls[pollId]) {
                polls[pollId] = {
                    ...row,
                    options:[]
                }
            }

            if (optionId && !polls[pollId].options.some(o => o.id === optionId)) {
                polls[pollId].options.push({
                    id: optionId,
                    name:optionName
                })
            }
        }

        return Object.values(polls).map(row => new PollSummaryQuery(
            row['poll.id'],
            row['poll.question'],
            row['poll.description'],
            new UserQuery(
                row['author.id'],
                row['author.name']
            ),
            new Date(row['poll.publicationDate']).toLocaleDateString(),
            row['options']
        ));

    }

}