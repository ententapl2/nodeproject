export default class PollSummaryQuery {

    #id;
    #question;
    #description;
    #author;
    #publicationDate;
    #options;

    constructor(
        id,
        question,
        description,
        author,
        publicationDate,
        options
    ) {
        this.#id = id;
        this.#question = question;
        this.#description = description;
        this.#author = author;
        this.#publicationDate = publicationDate;
        this.#options = options;
    }

    get id() {
        return this.#id;
    }

    get question() {
        return this.#question;
    }

    get description() {
        return this.#description;
    }

    get author() {
        return this.#author;
    }

    get publicationDate() {
        return this.#publicationDate;
    }

    get options() {
        return this.#options;
    }


}