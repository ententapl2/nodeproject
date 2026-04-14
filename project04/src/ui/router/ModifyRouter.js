import AuthenticationError from '../../app/error/AuthenticationError.js';
import ConflictError from '../../app/error/ConflictError.js';
import InvalidInputError from '../../app/error/InvalidInputError.js';
import NotFoundError from '../../app/error/NotFoundError.js';
import ModifyMapper from '../mapper/ModifyMapper.js';

export default class ModifyRouter {

    #pollService;

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
        });
    }
    
    getHandler(req, res) {
        const userId = req.session.userId;
        const userRoles = req.session.userRoles ?? []; 
        const pollId = req.params.pollId;
        if (!userId) return res.redirect('/login');

        try {
            const pollQuery = this.#pollService.loadPollForModifications(pollId, 0, 0, userId, userRoles);
            return this.render(req, res, ModifyMapper.validationToModifyViewModel(
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
        const pollId = req.params.pollId;

        const pollQuery = this.#pollService.loadPoll(pollId, 0, 0);
        const poll = ModifyMapper.pollQueryToCache(pollQuery);

        const question = req.body.question;
        const description = req.body.description;
        const newOptions = [].concat(req.body?.option ?? []);
        const oldOptions = Object.values(req.body?.oldOption || {});
        const options = oldOptions.concat(newOptions.map(o => ({
            id: null,
            value: o
        })));

        try {
            this.#pollService.modifyPoll(pollId, question, description, options, userId, userRoles);
            return res.redirect('/poll/' + pollId);
        } catch (e) {
            if (e instanceof AuthenticationError) throw 401;
            else if (e instanceof NotFoundError) throw 404;

            const modifyViewModel = ModifyMapper.validationToModifyViewModel(e.details, poll);
            return this.render(req, res, modifyViewModel); 
        }

    }


}