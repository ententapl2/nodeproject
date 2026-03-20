export default class ModifyViewModel {

    #errors;
    #cache;
    #pollId;

    constructor(errors, cache, pollId) {
        this.#errors = errors;
        this.#cache = cache;
        this.#pollId = pollId;
    }

    get errors() {
        return this.#errors;
    }

    get cache() {
        return this.#cache;
    }

    get pollId() {
        return this.#pollId;
    }

}

export class Cache {

    #question;
    #options;

    constructor(question, options) {
        this.#question = question;
        this.#options = options;
    }

    get question() {
        return this.#question;
    }

    get options() {
        return this.#options;
    }

}