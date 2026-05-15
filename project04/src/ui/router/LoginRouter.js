import LoginMapper from "../mapper/LoginMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class LoginRouter extends BaseRouter {

    #loginService;

    constructor(loginService) {
        super(
            'login',
            [],
            [new ExternalScript('/styles/login.css', 'text/css')],
            true
        );

        this.#loginService = loginService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
        this.logoutGetHandler = this.logoutGetHandler.bind(this);
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
            });
        }
    }

    async postHandler(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const user = await this.#loginService.login(username, password);
            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.userRoles = user.roles;
            req.session.save(function(err){
                if (err) return res.redirect('/');
            });
            return res.redirect('/');
        } catch (e) {
            const errors = e.details;
            const loginViewModel = LoginMapper.validationToLoginViewModel(errors, {username, password});
            return this.render(req, res, loginViewModel);
        }
    }

}