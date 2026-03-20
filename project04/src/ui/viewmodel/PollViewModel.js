export default class PollViewModel {

    #id;
    #question;
    #description;
    #authorId;
    #authorName;
    #publicationDate;
    #options;
    #hasVoted;
    #votes;
    #details;

    constructor(
        id,
        question,
        description,
        authorId,
        authorName,
        publicationDate,
        options,
        hasVoted,
        votes,
        details
    ) {
        this.#id = id;
        this.#question = question;
        this.#description = description;
        this.#authorId = authorId;
        this.#authorName = authorName;
        this.#publicationDate = publicationDate;
        this.#options = options;
        this.#hasVoted = hasVoted;
        this.#votes = votes;
        this.#details = details;
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

    get authorId() {
        return this.#authorId;
    }

    get authorName() {
        return this.#authorName;
    }

    get publicationDate() {
        return this.#publicationDate;
    }

    get options() {
        return this.#options;
    }

    get hasVoted() {
        return this.#hasVoted;
    }

    get votes() {
        return this.#votes;
    }

    get details() {
        return this.#details;
    }



}

export class PollDetailsModel {

    #isAuthor;
    #page;
    #isEnd;
    #hasVoted;

    constructor(isAuthor, page, isEnd, hasVoted) {
        this.#isAuthor = isAuthor;
        this.#page = page;
        this.#isEnd = isEnd;
        this.#hasVoted = hasVoted;
    }

    get isAuthor() {
        return this.#isAuthor;
    }

    get page() {
        return this.#page;
    }

    get isEnd() {
        return this.#isEnd;
    }
    
    get hasVoted() {
        return this.#hasVoted;
    }

}