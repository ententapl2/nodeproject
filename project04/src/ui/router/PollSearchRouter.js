import InvalidInputError from "../../app/error/InvalidInputError.js";
import NotFoundError from "../../app/error/NotFoundError.js";
import PollSearchMapper from "../mapper/PollSearchMapper.js";

export default class PollSearchRouter {

    #pollService;

    constructor(pollService) {
        this.#pollService = pollService;
        this.getHandler = this.getHandler.bind(this);
        this.render = this.render.bind(this);
    }

    render(req, res, pollSearchViewModel) {
        res.render('pollSearch', {
        scripts:[],
        styles:[{src:'/styles/pollSearch.css'}, {src:'/styles/components/gallery.css'}],
        account: {
            id:(req.session.userId ?? null),
            name:(req.session.userName ?? null)
        },
        pollSearchViewModel
        });
    }

    getHandler(req, res) {
        try {
            const phrase = req.query?.search ?? '';
            const page = parseInt(req.query?.page ?? 1);
            const limit = 20;

            if (isNaN(page) || page <=0 ) throw new NotFoundError('Nieprawidłowa liczba strony');
            if (typeof phrase !== 'string' || phrase.length === 0) throw new InvalidInputError('Nieprawidłowe hasło wyszukiwania');
            const polls = this.#pollService.loadSearchSummaries(phrase, limit, ((page-1)*limit));
            if (polls.length === 0) throw new NotFoundError('Nie znaleziono');

            const pollSearchViewModel = PollSearchMapper.pollSearchQueryToViewModel(polls, phrase, page, limit);
            this.render(req, res, pollSearchViewModel);
        } catch (e) {
            if (e instanceof NotFoundError) throw 404;
            else if (e instanceof InvalidInputError) throw 400;
            else throw 500;
        }
    }

} 