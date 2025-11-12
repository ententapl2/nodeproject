import express from "express";

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

    render(req, res, errors=[]) {
        res.render('login', {
            scripts:[],
            styles:[{src:'/styles/login.css'}],
            errors:errors
        });
    }

    getHandler(req, res) {
        if (req.session.userId) res.redirect('/');
        else this.render(req, res);
    }

    logoutGetHandler(req, res) {
        if (!req.session.userId) res.redirect('/');
        else {
            req.session.destroy(error => {
                if (error) return res.status(500).render('500');
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

        if (validation.length !== 0) return this.render(req, res, validation);
        try {
            const user = await this.#loginService.login(username, password);
            req.session.userId = user[0].id;
            req.session.userName = user[0].name;
            res.redirect('/');
        } catch (e) {
            if (e?.type === 1) this.render(req, res, ['Niepoprawne hasło']);
            else if (e?.type === 2) this.render(req, res, ['Użytkownik nie istnieje']);
            else this.render(req, res, ['Wystąpił nieoczekiwany błąd. Spróbuj ponownie']);
        }
    }

}