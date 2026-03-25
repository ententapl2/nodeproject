export default class NewViewModel {

    #errors;
    #cache;

    constructor(errors, cache) {
        this.#errors = errors;
        this.#cache = cache;
    }

    get errors() {
        return this.#errors;
    }

    get cache() {
        return this.#cache;
    }

}