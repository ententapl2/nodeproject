export default class UserStatsQuery {

    #id;
    #name;
    #pollCount;
    #voteCount;

    constructor(id, name, pollCount, voteCount) {
        this.#id = id;
        this.#name = name;
        this.#pollCount = pollCount;
        this.#voteCount = voteCount;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get pollCount() {
        return this.#pollCount;
    }

    get voteCount() {
        return this.#voteCount;
    }

}