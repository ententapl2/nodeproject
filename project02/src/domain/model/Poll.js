export default class Poll {

    #id;
    #name;
    #description;
    #author;
    #options;
    #votes;
    #publicationDate;

    constructor(
        id,
        name,
        description,
        author,
        options,
        votes,
        publicationDate
    ) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#author = author;
        this.#options = options;
        this.#votes = votes;
        this.#publicationDate = publicationDate;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get author() {
        return this.#author;
    }

    get options() {
        return this.#options;
    }

    get votes() {
        return this.#votes;
    }

    get publicationDate() {
        return this.#publicationDate;
    }


}

export class Vote {

    #user;
    #option;
    #publicationDate;

    constructor(
        user,
        option,
        publicationDate
    ) {
        this.#user = user;
        this.#option = option;
        this.#publicationDate = publicationDate;
    }

    get user() {
        return this.#user;
    }

    get option() {
        return this.#option;
    }

    get publicationDate() {
        return this.#publicationDate;
    }


}