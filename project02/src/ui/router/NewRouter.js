export default class NewRouter {

    #pollService;

    static #validateUserOutput(question, options) {
        var errors = [];
        if (!question) {
            errors.push('Nieprawidłowe dane wejściowe');
            return errors;
        };
        if (!Array.isArray(options)) errors.push('Nieprawidłowa lista opcji')
        else {
            options.some(option => {option.length <  1 || option.length > 100}) && errors.push('Nieprawidłowa lista odpowiedzi')
        }
        if (question.length < 1 || question.length > 500) errors.push('Pytanie musi mieścić się w limicie od 1 do 500 znaków');
        return errors;
    }

    constructor(pollService) {
        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, errors=[]) {
        res.render('new', {
            scripts:[{type:'text/javascript', src:'/scripts/new.js'}],
            styles:[{src:'/styles/new.css'}],
            errors:errors,
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null)
            },
        })
    }

    getHandler(req, res) {
        if (!req.session.userId) return res.redirect('/login'); 
        this.render(req, res);
    }

    postHandler(req, res) {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login'); 

        const question = req?.body?.question;
        const options = req?.body?.option;
        const validation = NewRouter.#validateUserOutput(question, options);

        if (validation.length !== 0) return this.render(req, res, validation);
        try {
            const newpollId = this.#pollService.createPoll(question, options, userId);
            res.redirect('/poll/' + newpollId);
        } catch (e) { 
            this.render(req, res, ['Wystąpił nieoczekiwany błąd. Spróbuj ponownie']);
        }

    }

    

}