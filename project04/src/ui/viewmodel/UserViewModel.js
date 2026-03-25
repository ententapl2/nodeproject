export default class UserViewModel {

    #userId;
    #userName;
    #userPolls;
    #pollCount;
    #voteCount;

    constructor(
        userId,
        userName,
        userPolls,
        pollCount,
        voteCount
    ) {
        this.#userId = userId;
        this.#userName = userName;
        this.#userPolls = userPolls;
        this.#pollCount = pollCount;
        this.#voteCount = voteCount;
    }

    get userId() {
        return this.#userId;
    }

    get userName() {
        return this.#userName;
    }

    get userPolls() {
        return this.#userPolls;
    }

    get pollCount() {
        return this.#pollCount;
    }

    get voteCount() {
        return this.#voteCount;
    }

}

export class UserPolls {

    #id;
    #question;
    #options;

    constructor(
        id,
        question,
        options
    ) {
        this.#id = id;
        this.#question = question;
        this.#options = options;
    }

    get id() {
        return this.#id;
    }

    get question() {
        return this.#question;
    }

    get options() {
        return this.#options;
    }

}