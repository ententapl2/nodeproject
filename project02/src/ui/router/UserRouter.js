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
            scripts:[{type:'text/javascript', src:'/scripts/user.js'}],
            styles:[{src:'/styles/user.css'}, {src:'/styles/components/gallery.css'}],
            ...userViewModel
        })
    }

    getHandler(req, res) {
        const userId = req.params.userId;

        const userPolls = this.#pollService.loadUserSummaries(userId);
        const stats = this.#userService.loadStats(userId);
        if (!stats) return res.status(404).render('404')
        try {
            this.render(req, res, {
                user: {
                    id:stats.id,
                    name:stats.name
                },
                userPolls,
                stats:{
                    pollCount:stats.pollCount,
                    voteCount:stats.voteCount
                },
                account: {
                    id:(req.session.userId ?? null),
                    name:(req.session.userName ?? null)
                }
            })
        } catch (e) {
            res.status(406).render('404');
        }
    }

}