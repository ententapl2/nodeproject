export default class PollQueryRepo {

    getPoll(pollId, votesLimit, votesOffset) {};
    getUserVoteFromPoll(pollId, userId) {};

    getPollsSummaryByLatestDate(limit, offset) {};
    getPollsSummaryByMostVotes(limit, offset) {};
    getPollsSummaryByPhrase(phrase, limit, offset) {};
    getPollsSummary(userId, limit, offset) {};

}