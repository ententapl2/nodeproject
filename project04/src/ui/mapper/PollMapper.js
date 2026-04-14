import PollViewModel, { PollDetailsModel } from "../viewmodel/PollViewModel.js";

export default class PollMapper {


    static pollQueryToHasVoted(pollQuery, authorId) {
        return Object.values(pollQuery.votes)
            .some(votesArray => votesArray
                .some(vote => vote.user.id === authorId)
            );
    }

    static pollQueryToOptions(pollQuery) {
        return pollQuery.options.map(option => ({
            ...option,
            voteCount: Number(((
                (pollQuery.votes[option.id]?.length ?? 0) / 
                Object.values(pollQuery.votes).flat().length) * 
                100
            ).toFixed(2))
        }));
    }

    static pollQueryToVotes(pollQuery, limit) {
        return pollQuery.options.flatMap((option, i) => (pollQuery.votes[option.id] ?? []).map(
            vote => ({
                userId: vote.user.id,
                userName: vote.user.name,
                option: i + 1,
                optionId: Number(option.id)
            })
        )).slice(0, limit);
    }

    static pollQueryToPollDetails(pollQuery, authorId, hasVoted, page, limit, authorRoles) {
        return new PollDetailsModel(
            pollQuery.author.id === authorId || authorRoles.some(role => role.name === 'admin'),
            page,
            Object.values(pollQuery.votes).flat().length <= limit,
            hasVoted
        );
    }

    static pollQueryToPollViewModel(pollQuery, authorId, hasVoted, page, limit, authorRoles) {
        return new PollViewModel(
            pollQuery.id,
            pollQuery.question,
            pollQuery.description,
            pollQuery.author.id,
            pollQuery.author.name,
            pollQuery.publicationDate,
            PollMapper.pollQueryToOptions(pollQuery),
            PollMapper.pollQueryToHasVoted(pollQuery),
            PollMapper.pollQueryToVotes(pollQuery, limit),
            PollMapper.pollQueryToPollDetails(pollQuery, authorId, hasVoted, page, limit, authorRoles) 
        );
    }


}