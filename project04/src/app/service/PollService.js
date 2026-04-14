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

    static #validateModifiedPoll(question, description, options) {
        var errors = [];
        options = options.map(o => (o?.value ?? "" ));

        if (!question) {
            errors.push('Nieprawidłowe pytanie');
            return errors;
        };
        if (!Array.isArray(options) || !options.every(o => typeof o === 'string') ) errors.push('Nieprawidłowa lista opcji');
        else {
            if (options.length < 1) errors.push('Minimalna liczba opcji to 1');
            if (options.length > 20) errors.push('Maksymalna liczba opcji to 20');
            options.some(option => 
                option.length <  1 || option.length > 100 || option.trim().length === 0
            ) && errors.push('Opcje muszą mieścić się w limicie od 1 do 100 znaków i nie mogą być puste');
            new Set(options).size !== options.length && errors.push('Opcje nie mogą się powtarzać');
        }
        if (question.length < 1 || question.length > 500) errors.push('Pytanie musi mieścić się w limicie od 1 do 500 znaków');
        if (typeof description !== 'string' || description.length > 800) errors.push('Opis nie może być dłuższy niż 800 znaków');
        return errors;
    }

    static #validateNewPoll(question, description, options) {
        var errors = [];
        if (!question) {
            errors.push('Nieprawidłowe pytanie');
            return errors;
        };
        if (!Array.isArray(options) || !options.every(o => typeof o === 'string')) errors.push('Nieprawidłowa lista opcji');
        else {
            if (options.length < 1) errors.push('Minimalna liczba opcji to 1'); 
            if (options.length > 20) errors.push('Maksymalna liczba opcji to 20');
            options.some(option => 
                typeof option !== 'string' || option.length < 1 || option.length > 100 || option.trim().length === 0
            ) && errors.push('Nieprawidłowa lista opcji - każda z nich powinna mieścić się między 1 a 100 znakami');
            new Set(options).size !== options.length && errors.push('Opcje nie mogą się powtarzać');
        }
        if (question.length < 1 || question.length > 500) errors.push('Pytanie musi mieścić się w limicie od 1 do 500 znaków');
        if (typeof description !== 'string' || description.length > 800) errors.push('Opis nie może być dłuższy niż 800 znaków');
        return errors;
    }

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

    loadHasVoted(pollId, userId) {        
        const option = this.#pollQueryRepo.getUserVoteFromPoll(pollId, userId);
        return option !== null;
    }

    loadPoll(pollId, limit, page) {

        const offset = (page - 1) * limit;
        const poll = this.#pollQueryRepo.getPoll(pollId, limit + 1, offset);

        if (!poll) throw new NotFoundError('Nie znaleziono ankiety');
        else if (!Object.keys(poll.votes).length && page !== 1) throw new NotFoundError('Brak kolejnych stron stron');
        else return poll;
    }

    loadPollForModifications(pollId, limit, page, userId, userRoles) {
        const poll = this.loadPoll(pollId, limit, page);
        if (poll.author.id != userId && !userRoles.some(role => role.name === 'admin')) throw new AuthenticationError('Brak uprawnień do modyfikacji ankiety');
        return poll;

    }

    loadSearchSummaries(phrase, limit=20, page) {   
        if (typeof phrase !== 'string' || phrase.length === 0) throw new InvalidInputError('Nieprawidłowe dane', 'Nieprawidłowe hasło wyszukiwania');
        const offset = (page - 1) * limit;
        const polls = this.#pollQueryRepo.getPollsSummaryByPhrase(phrase, limit+1, offset);

        if (polls.length === 0) throw new NotFoundError('Nie znaleziono');
        return polls;
    }

    loadUserSummaries(userId) {
        const polls = this.#pollQueryRepo.getPollsSummary(userId);
        return polls;
    }

    assignVoteToPoll(pollId, userId, optionId) {
        try {
            this.#pollRepo.addVote(pollId, userId, optionId, Date.now());
        } catch (e) {
            throw new InvalidInputError('Niepoprawne dane');
        }
    }

    createPoll(question, description, options, userId) {
        const validation = PollService.#validateNewPoll(question, description, options);
        if (validation.length !== 0) throw new InvalidInputError('Nieprawidłowe dane wejściowe', validation);

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
                return newId;
            });
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

        if (!pollId) throw new NotFoundError('Nie znaleziono ankiety');
        if (!userId) throw new AuthenticationError('Brak uprawnień do modyfikacji ankiety');

        const validation = PollService.#validateModifiedPoll(question, description, options);
        if (validation.length !== 0) throw new InvalidInputError('Nieprawidłowe dane wejściowe', validation);

        const poll = this.#pollQueryRepo.getPoll(pollId, 0, 0);
        if (!poll) throw new NotFoundError('Nie znaleziono ankiety');
        if (options.some(option => option.id !== null && !poll.options.some(o => o.id == option.id))) throw new InvalidInputError('Nieprawidlowe dane wejściowe', ['Nieprawidłowe opcje']);
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
                else this.#pollRepo.modifyOption(option.id,option.value, pollId);
            });
        });

    }

}