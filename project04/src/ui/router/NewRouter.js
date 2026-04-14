import NewMapper from "../mapper/NewMapper.js";

export default class NewRouter {

    #pollService;

    constructor(pollService) {
        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, newViewModel) {
        res.render('new', {
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null),
                csrf: req.csrfToken()
            },
            newViewModel,
            scripts:[{type:'text/javascript', src:'/scripts/new.js'}],
            styles:[{src:'/styles/new.css'}]
        });
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