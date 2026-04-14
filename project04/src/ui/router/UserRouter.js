import UserMapper from "../mapper/UserMapper.js";

export default class UserRouter {

    #pollService;
    #userService;

    constructor(pollService, userService) {
        this.#pollService = pollService;
        this.#userService = userService;
        this.getHandler = this.getHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, userViewModel) {
        res.render('user', {
            account:{
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null)
            },
            userViewModel,
            scripts:[{type:'text/javascript', src:'/scripts/user.js'}],
            styles:[{src:'/styles/user.css'}, {src:'/styles/components/gallery.css'}]
        });
    }

    getHandler(req, res) {
        const userId = req.params.userId;

        const userPolls = this.#pollService.loadUserSummaries(userId);
        const stats = this.#userService.loadStats(userId);

        if (!stats || !userPolls) throw 404;
        const userViewModel = UserMapper.userQueryToUserViewModel(stats, userPolls);
        this.render(req, res, userViewModel);
    }

}