import NewMapper from "../mapper/NewMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class NewRouter extends BaseRouter {

    #pollService;

    constructor(pollService) {
        super(
            'new', 
            [new ExternalScript('/scripts/new.js', 'text/javascript')],
            [new ExternalScript('/styles/new.css', 'text/css')],
            true
        );

        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
    }

    getHandler(req, res) {
        if (!req.session.userId) return res.redirect('/login'); 
        this.render(req, res, NewMapper.validationToNewViewModel([], {}));
    }

    postHandler(req, res) {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login'); 

        const question = req.body.question;
        const description = req.body.description;
        const options = req.body.option;

        try {
            const newpollId = this.#pollService.createPoll(question, description, options, userId);
            res.redirect('/poll/' + newpollId);
        } catch (e) { 
            const newViewModel = NewMapper.validationToNewViewModel(e.details, {question, description, options});
            this.render(req, res, newViewModel);
        }

    }

    

}