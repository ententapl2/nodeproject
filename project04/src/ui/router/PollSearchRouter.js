import InvalidInputError from "../../app/error/InvalidInputError.js";
import NotFoundError from "../../app/error/NotFoundError.js";
import PollSearchMapper from "../mapper/PollSearchMapper.js";
import BaseRouter, { ExternalScript } from "./BaseRouter.js";

export default class PollSearchRouter extends BaseRouter {

    #pollService;

    constructor(pollService) {
        super(
            'pollSearch',
            [],
            [
                new ExternalScript('/styles/pollSearch.css', 'text/css'),
                new ExternalScript('/styles/components/gallery.css', 'text/css')
            ]
        );

        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
    }

    getHandler(req, res) {
        try {
            const phrase = req.query?.search ?? '';
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const limit = 20;

            const polls = this.#pollService.loadSearchSummaries(phrase, limit, page);
            const pollSearchViewModel = PollSearchMapper.pollSearchQueryToViewModel(polls, phrase, page, limit);
            return this.render(req, res, pollSearchViewModel);
        } catch (e) {
            if (e instanceof NotFoundError) throw 404;
            else if (e instanceof InvalidInputError) throw 400;
            else throw 500;
        }
    }

} 