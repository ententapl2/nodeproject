import UserMapper from "../mapper/UserMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class UserRouter extends BaseRouter {

    #pollService;
    #userService;

    constructor(pollService, userService) {
        super(
            'user',
            [new ExternalScript('/scripts/user.js', 'text/javascript')],
            [
                new ExternalScript('/styles/user.css', 'text/css'),
                new ExternalScript('/styles/components/gallery.css', 'text/css')
            ]
        );

        this.#pollService = pollService;
        this.#userService = userService;
        this.getHandler = this.getHandler.bind(this);
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