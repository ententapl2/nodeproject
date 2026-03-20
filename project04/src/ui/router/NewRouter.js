import NewMapper from "../mapper/NewMapper.js";

export default class NewRouter {

    #pollService;

    static #validateUserOutput(question, description, options) {
        var errors = [];
        if (!question) {
            errors.push('Nieprawidłowe pytanie');
            return errors;
        };
        if (!Array.isArray(options) || !options.every(o => typeof o === 'string')) errors.push('Nieprawidłowa lista opcji')
        else {
            if (options.length < 1) errors.push('Minimalna liczba opcji to 1'); 
            if (options.length > 20) errors.push('Maksymalna liczba opcji to 20')
            options.some(option => 
                typeof option !== 'string' || option.length < 1 || option.length > 100 || option.trim().length === 0
            ) && errors.push('Nieprawidłowa lista odpowiedzi')
            new Set(options).size !== options.length && errors.push('Opcje nie mogą się powtarzać')
        }
        if (question.length < 1 || question.length > 500) errors.push('Pytanie musi mieścić się w limicie od 1 do 500 znaków');
        if (typeof description !== 'string' || description.length > 800) errors.push('Opis nie może być dłuższy niż 800 znaków');
        return errors;
    }

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
        })
    }

    getHandler(req, res) {
        if (!req.session.userId) return res.redirect('/login'); 
        this.render(req, res, NewMapper.validationToNewViewModel([], {}));
    }

    postHandler(req, res) {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login'); 

        const question = req.body?.question;
        const description = req.body?.description ?? '';
        const options = req.body?.option;

        const validation = NewRouter.#validateUserOutput(question, description, options);
        const newViewModel = NewMapper.validationToNewViewModel(validation, {question, description, options});

        if (validation.length !== 0) return this.render(req, res, newViewModel);
        try {
            const newpollId = this.#pollService.createPoll(question, description, options, userId);
            res.redirect('/poll/' + newpollId);
        } catch (e) { 
            validation.push('Wystąpił nieoczekiwany błąd. Spróbuj ponownie');
            const newViewModel2 = NewMapper.validationToNewViewModel(validation, {question, description, options});
            this.render(req, res, newViewModel2);
        }

    }

    

}