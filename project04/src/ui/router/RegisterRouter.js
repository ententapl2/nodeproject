import RegisterMapper from "../mapper/RegisterMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class RegisterRouter extends BaseRouter {

    #registerService;

    constructor(registerService) {
        super(
            'register', 
            [],
            [new ExternalScript('/styles/login.css', 'text/css')],
            true
        );

        this.#registerService = registerService;
        this.getHandler = this.getHandler.bind(this);
        this.postHandler = this.postHandler.bind(this);
    }

    getHandler(req, res) {
        if (req.session.userId) res.redirect('/');
        else this.render(req, res, RegisterMapper.validationToRegisterViewModel([], {}));
    }

    async postHandler(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        try {
            const newUser = await this.#registerService.register(username, password);
            req.session.userId = newUser[0].id;
            req.session.userName = newUser[0].name;
            return res.redirect('/');
        } catch (e) {
            const validation = e.details;
            const registerViewModel = RegisterMapper.validationToRegisterViewModel(validation, {username, password});
            return this.render(req, res, registerViewModel);
        }
        
    }


}