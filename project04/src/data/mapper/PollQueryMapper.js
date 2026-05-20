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
                publicationDate: new Date(vote['vote.publicationDate']).toLocaleDateString('pl-PL', {day:'2-digit', month:'2-digit', year:'numeric'})
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
            new Date(pollQuery[0]['poll.publicationDate']).toLocaleDateString('pl-PL', {day:'2-digit', month:'2-digit', year:'numeric'}),
            pollQuery.map(o => ({
                id: o['option.id'],
                name: o['option.name']
            })),
            PollQueryMapper.votesEntitiesToObjects(votesQuery)
        ) : null;

    }

    static pollEntitiestoPollsSummary(query) {
        
        const pollsMap = new Map();

        for (const row of query) {
            const pollId = row['poll.id'];
            const optionId = row['option.id'];

            let poll = pollsMap.get(pollId);

            if (!poll) {
                poll = {
                    id: pollId,
                    question: row['poll.question'],
                    description: row['poll.description'],
                    author: new UserQuery(
                        row['author.id'],
                        row['author.name']
                    ),
                    publicationDate: new Date(row['poll.publicationDate']),
                    options: [],
                    _optionIds: new Set()
                };

                pollsMap.set(pollId, poll);
            }

            if (optionId && !poll._optionIds.has(optionId)) {
                poll._optionIds.add(optionId);
                poll.options.push({
                    id: optionId,
                    name: row['option.name']
                });
            }
        }

        return Array.from(pollsMap.values()).map(p =>
            new PollSummaryQuery(
                p.id,
                p.question,
                p.description,
                p.author,
                p.publicationDate.toLocaleDateString('pl-PL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }),
                p.options
            )
        );

    }

    static optionEntityOptionObject(query) {
        return query.length !== 0 ? ({
            id: query[0]['option.id'],
            name: query[0]['option.name']
        }) : null; 
    }

}