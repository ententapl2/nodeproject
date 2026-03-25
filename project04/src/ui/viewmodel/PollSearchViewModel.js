export default class PollSearchViewModel {

    #polls;
    #phrase;
    #page;
    #isEnd;

    constructor(polls, phrase, page, isEnd) {
        this.#polls = polls;
        this.#phrase = phrase;
        this.#page = page;
        this.#isEnd = isEnd;
    }

    get polls() {
        return this.#polls;
    }

    get phrase() {
        return this.#phrase;
    }

    get page() {
        return this.#page;
    }

    get isEnd() {
        return this.#isEnd;
    }


}