import Poll from '../../domain/model/Poll.js';
import User from '../../domain/model/User.js';

export default class PollService {

    #pollQueryRepo;
    #pollRepo;

    constructor(pollQueryRepo, pollRepo) {
        this.#pollQueryRepo = pollQueryRepo;
        this.#pollRepo = pollRepo;
    }

    loadMostVotesSummaries() {
        return this.#pollQueryRepo.getPollsSummaryByMostVotes();
    }

    loadRecentSummaries() {
        return this.#pollQueryRepo.getPollsSummaryByLatestDate();
    }

    loadPoll(pollId, limit=10, offset=0) {
        const poll = this.#pollQueryRepo.getPoll(pollId, limit+1, offset);
        if (!poll) throw {type: 1, message:'Nie znaleziono ankiety'};
        else return poll;
    }

    loadUserSummaries(userId) {
        const polls = this.#pollQueryRepo.getPollsSummary(userId);
        return polls;
    }

    assignVoteToPoll(pollId, userId, optionId) {
        try {
            this.#pollRepo.addVote(pollId, userId, optionId);
        } catch (e) {
            console.error(e.message);
            throw {type: 1, message: 'Incorrect request'}
        }
    }

    createPoll(question, options, userId) {
        try {
            const poll = new Poll(
                null,
                question,
                '',
                new User(userId, null, null),
                null,
                null,
                Date.now()
            );
            const newId = this.#pollRepo.addPoll(poll);
            options.forEach(option => {
                this.#pollRepo.addOption(newId, option);
            });
            return newId;
        } catch (e) {
            throw {
                type:2,
                message:'Error while creating poll'
            };
        }
    }

    deletePoll(pollId) {
        try {
            this.#pollRepo.deletePoll(pollId);
        } catch (e) {
            throw {
                type:3,
                message:'Error while deleting poll'
            };
        }
    }


}