import InvalidInputError from "../../app/error/InvalidInputError.js";
import NotFoundError from "../../app/error/NotFoundError.js";
import LoginMapper from "../mapper/LoginMapper.js";

export default class LoginRouter {

    #loginService;
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

    constructor(loginService) {
        this.#loginService = loginService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.logoutGetHandler = this.logoutGetHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, loginViewModel) {
        res.render('login', {
            scripts:[],
            styles:[{src:'/styles/login.css'}],
            loginViewModel,
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null),
                csrf: req.csrfToken()
            }
        });
    }

    getHandler(req, res) {
        if (req.session.userId) res.redirect('/');
        else this.render(req, res, LoginMapper.validationToLoginViewModel([], {}));
    }

    logoutGetHandler(req, res) {
        if (!req.session.userId) res.redirect('/');
        else {
            req.session.destroy(error => {
                if (error) throw 500;
                else {
                    res.clearCookie('connect.sid');
                    res.redirect('/');
                }
            })
        }
    }

    async postHandler(req, res) {
        const username = req?.body?.username;
        const password = req?.body?.password;
        const validation = LoginRouter.#validateUserOutput(username, password);
        const loginViewModel = LoginMapper.validationToLoginViewModel(validation, {username, password});

        if (validation.length !== 0) return this.render(req, res, loginViewModel);
        try {
            const user = await this.#loginService.login(username, password);
            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.userRoles = user.roles;
            req.session.save(function(err){if (err) return this.render(req, res, loginViewModel);})
            res.redirect('/');
        } catch (e) {
            if (e instanceof InvalidInputError) validation.push('Niepoprawne hasło');
            else if (e instanceof NotFoundError) validation.push('Użytkownik nie istnieje');
            else validation.push('Wystąpił nieoczekiwany błąd. Spróbuj ponownie');
            const loginViewModel2 = LoginMapper.validationToLoginViewModel(validation, {username, password});
            this.render(req, res, loginViewModel2);
        }
    }

}