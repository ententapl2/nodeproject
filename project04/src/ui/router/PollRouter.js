import AuthenticationError from "../../app/error/AuthenticationError.js";
import NotFoundError from "../../app/error/NotFoundError.js";
import PollMapper from "../mapper/PollMapper.js";

export default class PollRouter {

    #pollService;

    constructor(pollService) {
        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, pollViewModel) {
        res.render('poll', {
            scripts:[{type:'text/javascript', src:'/scripts/poll.js'}],
            styles:[{src:'/styles/poll.css'}, {src:'/styles/components/gallery.css'}],
            pollViewModel,
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null)
            }
        })
    }

    getHandler(req, res) {
        const userId = req.session.userId;
        const userRoles = req.session?.userRoles ?? []; 
        const pollId = req.params.pollId;
        if (!pollId) throw 404;
        try {
            const page = (req.query.page ?? 1);
            const poll = this.#pollService.loadPoll(pollId, 10, ((page-1)*10));
            
            if (!Object.keys(poll?.votes).length && page !== 1) throw NotFoundError('Brak kolejnych stron')
            const pollViewModel = PollMapper.pollQueryToPollViewModel(poll, userId, page, userRoles);
            this.render(req, res, pollViewModel);
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
            const poll = this.#pollService.loadPoll(pollId);
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