import AuthenticationError from '../../app/error/AuthenticationError.js';
import ConflictError from '../../app/error/ConflictError.js';
import InvalidInputError from '../../app/error/InvalidInputError.js';
import NotFoundError from '../../app/error/NotFoundError.js';
import ModifyMapper from '../mapper/ModifyMapper.js';

export default class ModifyRouter {

    #pollService;

    static #validateUserOutput(question, description, options) {
        var errors = [];
        if (!question) {
            errors.push('Nieprawidłowe pytanie');
            return errors;
        };
        if (!Array.isArray(options) || !options.every(o => typeof o === 'string') ) errors.push('Nieprawidłowa lista opcji')
        else {
            if (options.length < 1) errors.push('Minimalna liczba opcji to 1')
            if (options.length > 20) errors.push('Maksymalna liczba opcji to 20')
            options.some(option => 
                option.length <  1 || option.length > 100 || option.trim().length === 0
            ) && errors.push('Opcje muszą mieścić się w limicie od 1 do 100 znaków i nie mogą być puste')
            new Set(options).size !== options.length && errors.push('Opcje nie mogą się powtarzać')
        }
        if (question.length < 1 || question.length > 500) errors.push('Pytanie musi mieścić się w limicie od 1 do 500 znaków');
        if (typeof description !== 'string' || description.length > 800) errors.push('Opis nie może być dłuższy niż 800 znaków');
        return errors;

    }

    constructor(pollService) {
        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.putHandler = this.putHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, modifyViewModel) {
        res.render('modify', {
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null),
                csrf: req.csrfToken()
            },
            modifyViewModel,
            scripts:[{src:'/scripts/modify.js', type:'text/javascript'}],
            styles:[{src:'/styles/new.css'}]
        })
    }
    
    getHandler(req, res) {
        const userId = req.session.userId;
        const userRoles = req.session.userRoles ?? []; 
        const pollId = req.params.pollId;
        if (!userId) return res.redirect('/login');

        try {
            const pollQuery = this.#pollService.loadPoll(pollId, 0, 0);
            if (pollQuery.author.id != userId && !userRoles.some(role => role.name === 'admin')) throw new AuthenticationError('Brak uprawnień do modyfikacji ankiety');
            this.render(req, res, ModifyMapper.validationToModifyViewModel(
                [], 
                ModifyMapper.pollQueryToCache(pollQuery), 
                pollId
            ));
        } catch (e) {
            if (e instanceof NotFoundError) throw 404;
            else if (e instanceof AuthenticationError) throw 401;
            else throw 500;
        }
    }

    putHandler(req, res) {

        const userId = req.session.userId;
        const userRoles = req.session.userRoles ?? []; 
        const pollId = req?.params?.pollId;
        if (!pollId) throw 404;
        if (!userId) throw 401;

        const pollQuery = this.#pollService.loadPoll(pollId, 0, 0);
        const poll = ModifyMapper.pollQueryToCache(pollQuery);

        const question = req.body?.question;
        const description = req.body?.description ?? '';
        const newOptions = [].concat(req.body?.option ?? []);
        const oldOptions = Object.values(req.body?.oldOption || {});
        const options = oldOptions.concat(newOptions.map(o => ({
            id: null,
            value: o
        })));

        const validation = ModifyRouter.#validateUserOutput(question, description, options.map(o => (o?.value ?? "" )));
        const modifyViewModel = ModifyMapper.validationToModifyViewModel(validation, poll, pollId);
        if (validation.length !== 0) return this.render(req, res, modifyViewModel);
        try {
            this.#pollService.modifyPoll(pollId, question, description, options, userId, userRoles);
            return res.redirect('/poll/' + pollId);
        } catch (e) {
            if (e instanceof AuthenticationError) throw 401;
            else if (e instanceof NotFoundError) throw 404;
            else if (e instanceof ConflictError) validation.push('Opcje nie mogą się powtarzać');
            else if (e instanceof InvalidInputError) validation.push('Nieprawidłowa lista opcji');
            else validation.push('Wystąpił nieoczekiwany błąd. Spróbuj ponownie');

            const modifyViewModel2 = ModifyMapper.validationToModifyViewModel(validation, poll);
            return this.render(req, res, modifyViewModel2); 
        }

    }


}