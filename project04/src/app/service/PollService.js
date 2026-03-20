import Poll from '../../domain/model/Poll.js';
import User from '../../domain/model/User.js';
import ApplicationError from '../error/ApplicationError.js';
import AuthenticationError from '../error/AuthenticationError.js';
import ConflictError from '../error/ConflictError.js';
import InvalidInputError from '../error/InvalidInputError.js';
import NotFoundError from '../error/NotFoundError.js';

export default class PollService {

    #pollQueryRepo;
    #pollRepo;
    #unitOfWork;

    constructor(pollQueryRepo, pollRepo, unitOfWork) {
        this.#pollQueryRepo = pollQueryRepo;
        this.#pollRepo = pollRepo;
        this.#unitOfWork = unitOfWork;
    }

    loadMostVotesSummaries() {
        return this.#pollQueryRepo.getPollsSummaryByMostVotes();
    }

    loadRecentSummaries() {
        return this.#pollQueryRepo.getPollsSummaryByLatestDate();
    }

    loadPoll(pollId, limit=10, offset=0) {
        const poll = this.#pollQueryRepo.getPoll(pollId, limit+1, offset);
        if (!poll) throw new NotFoundError('Nie znaleziono ankiety');
        else return poll;
    }

    loadSearchSummaries(phrase, limit=20, offset=0) {
        const polls = this.#pollQueryRepo.getPollsSummaryByPhrase(phrase, limit+1, offset);
        return polls;
    }

    loadUserSummaries(userId) {
        const polls = this.#pollQueryRepo.getPollsSummary(userId);
        return polls;
    }

    assignVoteToPoll(pollId, userId, optionId) {
        try {
            this.#pollRepo.addVote(pollId, userId, optionId);
        } catch (e) {
            throw new InvalidInputError('Niepoprawne dane');
        }
    }

    createPoll(question, description, options, userId) {
        try {
            const poll = new Poll(
                null,
                question,
                description,
                new User(userId, null, null),
                null,
                null,
                Date.now()
            );
            const newId = this.#unitOfWork.executeTransaction(() => {
                const newId = this.#pollRepo.addPoll(poll);
                options.forEach(option => {
                    this.#pollRepo.addOption(newId, option);
                });
                return newId
            })
            return newId;
        } catch (e) {
            throw new ApplicationError('Błąd przy tworzeniu ankiety');
        }
    }

    deletePoll(pollId) {
        try {
            this.#pollRepo.deletePoll(pollId);
        } catch (e) {
            throw new ApplicationError('Błąd przy usuwaniu ankiety');
        }
    }

    modifyPoll(pollId, question, description, options, userId, userRoles) {

        const poll = this.#pollQueryRepo.getPoll(pollId, 0, 0);
        if (!poll) throw new NotFoundError('Nie znaleziono ankiety');
        if (options.some(option => option.id !== null && !poll.options.some(o => o.id == option.id))) throw new InvalidInputError('Nieprawidlowe opcje');
        if (poll.author.id != userId && !userRoles.some(role => role.name === 'admin')) throw new AuthenticationError('Brak uprawnień do modyfikacji ankiety');

        const removedOptions = poll.options.filter(option => !options.some(o => o.id == option.id));
        if (options.some(o => poll.options.some(pollOption =>
            o.value === pollOption.name &&
            o.id != pollOption.id &&
            !removedOptions.some(r => r.id == pollOption.id)
        ))) throw new ConflictError('Opcje nie mogą się powtarzać'); 

        const modifiedPoll = new Poll(
            pollId,
            question,
            description,
            poll.author,
            poll.options,
            poll.votes,
            Date.parse(poll.publicationDate.split('.').reverse().join('-'))
        );
        this.#unitOfWork.executeTransaction(() => {
            this.#pollRepo.modifyPoll(modifiedPoll);
            removedOptions.forEach(option => {
                this.#pollRepo.deleteOption(option.id);
            });
            options.forEach(option => {
                if (option.id === null) this.#pollRepo.addOption(pollId, option.value);
                else this.#pollRepo.modifyOption(option.id,option.value, pollId)
            });
        })

    }

}