import RegisterMapper from "../mapper/RegisterMapper.js";

export default class RegisterRouter {

    #registerService;

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
        });
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