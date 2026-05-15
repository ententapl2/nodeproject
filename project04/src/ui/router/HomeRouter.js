import HomeMapper from "../mapper/HomeMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class HomeRouter extends BaseRouter {

    #pollService;
    #userService;

    constructor(pollService, userService) {
        super(
            'home', 
            [],
            [
                new ExternalScript('/styles/home.css', 'text/css'),
                new ExternalScript('/styles/components/homeAnimation.css', 'text/css'),
                new ExternalScript('/styles/components/gallery.css', 'text/css')
            ]
        );

        this.#pollService = pollService;
        this.#userService = userService;
        this.getHandler = this.getHandler.bind(this);
    }

    getHandler(req, res) {
        const mostPopularPolls = this.#pollService.loadMostVotesSummaries();
        const recentPolls = this.#pollService.loadRecentSummaries();
        const mostActiveUsers = this.#userService.loadDashobardSummaries();

        const homeViewModel = HomeMapper.homeQueryToViewModel(
            mostPopularPolls,
            recentPolls,
            mostActiveUsers
        );

        this.render(req, res, homeViewModel);
    }

}