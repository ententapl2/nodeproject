export default class PollQueryRepo {

    getPoll(pollId, votesLimit, votesOffset) {};

    getPollsSummaryByLatestDate(limit, offset) {};
    getPollsSummaryByMostVotes(limit, offset) {};
    getPollsSummary(userId, limit, offset) {};

}