export default class PollQuery {

    #id;
    #question;
    #description;
    #author;
    #publicationDate;
    #options;
    #votes;

    constructor(
        id, 
        question, 
        description, 
        autor,
        publicationDate, 
        options, 
        votes
    ) {
        this.#id = id;
        this.#question = question;
        this.#description = description;
        this.#author = autor;
        this.#publicationDate = publicationDate;
        this.#options = options;
        this.#votes = votes;
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

    get votes() {
        return this.#votes;
    }

}