export default class HomeRouter {

    #pollService;
    #userService;

    constructor(pollService, userService) {
        this.#pollService = pollService;
        this.#userService = userService;
        this.getHandler = this.getHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, userViewModel) {
        res.render('home', {
            ...userViewModel,
            scripts: [{type: 'text/javascript', src:'/scripts/home.js'}],
            styles:[{src:'/styles/home.css'}, {src:'/styles/components/homeAnimation.css'}, {src:'/styles/components/gallery.css'}]
        })
    }

    getHandler(req, res) {
        const mostPopularPolls = this.#pollService.loadMostVotesSummaries();
        const recentPolls = this.#pollService.loadRecentSummaries();
        const mostActiveUsers = this.#userService.loadDashobardSummaries();
        this.render(req, res, {
            account: {
                id:(req.session.userId ?? null),
                name:(req.session.userName ?? null)
            },
            mostPopularPolls,
            recentPolls,
            mostActiveUsers
        })
    }

}