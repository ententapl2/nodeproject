import ConflictError from "../../app/error/ConflictError.js";
import RegisterMapper from "../mapper/RegisterMapper.js";

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

    render(req, res, registerViewModel) {
        res.render('register', {
            scripts:[],
            styles:[{src:'/styles/login.css'}],
            registerViewModel,
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null),
                csrf: req.csrfToken()
            }
        })
    }

    getHandler(req, res) {
        if (req.session.userId) res.redirect('/');
        else this.render(req, res, RegisterMapper.validationToRegisterViewModel([], {}));
    }

    async postHandler(req, res) {
        const username = req?.body?.username.trim() ?? '';
        const password = req?.body?.password;
        const validation = RegisterRouter.#validateUserOutput(username, password);
        const registerViewModel = RegisterMapper.validationToRegisterViewModel(validation, {username, password});

        if (req.session.userId) return res.redirect('/');
        if (validation.length !== 0) return this.render(req, res, registerViewModel);
        try {
            const newUser = await this.#registerService.register(username, password);
            req.session.userId = newUser[0].id;
            req.session.userName = newUser[0].name;
            res.redirect('/');
        } catch (e) {
            if (e instanceof ConflictError) validation.push("Użytkownik o takiej nazwie już istnieje")
            else validation.push("Wystąpił nieoczekiwany błąd. Spróbuj ponownie")
            const registerViewModel2 = RegisterMapper.validationToRegisterViewModel(validation, {username, password});
            this.render(req, res, registerViewModel2);
        }
        
    }


}