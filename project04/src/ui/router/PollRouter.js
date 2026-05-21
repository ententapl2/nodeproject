import AuthenticationError from "../../app/error/AuthenticationError.js";
import NotFoundError from "../../app/error/NotFoundError.js";
import PollMapper from "../mapper/PollMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class PollRouter extends BaseRouter {

    #pollService;

    constructor(pollService) {
        super(
            'poll',
            [new ExternalScript('/scripts/poll.js', 'text/javascript')],
            [
                new ExternalScript('/styles/poll.css', 'text/css'),
                new ExternalScript('/styles/components/gallery.css', 'text/css')
            ],
            true
        );

        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
    }

    getHandler(req, res) {
        const userId = parseInt(req.session.userId, 10);
        const pollId = parseInt(req.params.pollId, 10);
        const userRoles = req.session.userRoles ?? [];
        if (!pollId) throw 404;
        try {
            const limit = 10;
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);  
            
            const poll = this.#pollService.loadPoll(pollId, limit, page);
            const hasVoted = this.#pollService.loadHasVoted(pollId, userId);

            const pollViewModel = PollMapper.pollQueryToPollViewModel(poll, userId, hasVoted, page, limit, userRoles);
            return this.render(req, res, pollViewModel);
        } catch (e) {
            if (e instanceof NotFoundError) throw 404;
            else throw 500;
        }
    }

    postHandler(req, res) {
        const pollId = req.params.pollId;
        const optionId = req.body.option;
        const userId = req.session.userId;

        if (!userId) return res.redirect('/login');
        else if (!pollId || !optionId) throw 404;
        else {
            try {
                this.#pollService.assignVoteToPoll(pollId, userId, optionId);
                res.redirect(`/poll/${pollId}`);
            } catch (e) {
                throw 400;
            }
        }

    }

    deleteHandler(req, res) {
        const pollId = req.params.pollId;
        const userRoles = req.session?.userRoles ?? []; 
        const userId = req.session.userId;

        try {
            const poll = this.#pollService.loadPoll(pollId, 0, 1);
            if (poll.author.id === userId || userRoles.some(role => role.name === 'admin')) {
                this.#pollService.deletePoll(pollId);
                res.redirect('/');
            } else throw new AuthenticationError('Brak uprawnień do usunięcia ankiety');
        } catch (e) {
            if (e instanceof NotFoundError) throw 404;
            else if (e instanceof AuthenticationError) throw 401;
            else throw 500;
        }
    }

}