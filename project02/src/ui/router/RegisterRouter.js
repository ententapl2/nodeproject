export default class RegisterRouter {

    #registerService;
    static #validateUserOutput(username, password) {
        var errors = [];
        if (!username || !password) {
            errors.push('Nieprawidłowe dane wejściowe');
            return errors;
        };
        if (username.length < 3 || username.length > 20) errors.push('Nazwa użytkownika musi miec od trzech do 20 znaków');
        if (password.length < 12 || password.length > 50) errors.push('Hasło musi mieć od 12 znaków do 50');
        if (!/[A-Z]/.test(password)) errors.push('Hasło musi zawierać jeden duży znak');
        if (/\s/g.test(username)) errors.push('Nazwa użytkownika nie może mieć spacji');
        if (/\s/g.test(password)) errors.push('Hasło nie może mieć spacji');
        return errors;
    }

    constructor(registerService) {
        this.#registerService = registerService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, errors=[]) {
        res.render('register', {
            scripts:[],
            styles:[{src:'/styles/login.css'}],
            errors:errors
        })
    }

    getHandler(req, res) {
        if (req.session.userId) res.redirect('/');
        else this.render(req, res);
    }

    async postHandler(req, res) {
        const username = req?.body?.username.trim() ?? '';
        const password = req?.body?.password;
        const validation = RegisterRouter.#validateUserOutput(username, password);

        if (validation.length !== 0) return this.render(req, res, validation);
        try {
            const newUser = await this.#registerService.register(username, password);
            if (newUser?.length === 0 ) throw {type:3, message:'Nieoczekiwany błąd po stronie serwera. Spróbuj ponownie'};
            req.session.userId = newUser[0].id;
            req.session.userName = newUser[0].name;
            res.redirect('/');
        } catch (e) {
            if (e?.type === 1) this.render(req, res, ['Użytkownik o takiej nazwie już istnieje'])  ;
            else this.render(req, res, ['Wystąpił nieoczekiwany błąd. Spróbuj ponownie']);
        }
        
    }


}