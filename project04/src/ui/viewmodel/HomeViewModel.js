export default class HomeViewModel {

    #mostPopularPolls;
    #recentPolls;
    #mostActiveUsers;

    constructor(
        mostPopularPolls,
        recentPolls,
        mostActiveUsers
    ) {
        this.#mostPopularPolls = mostPopularPolls;
        this.#recentPolls = recentPolls;
        this.#mostActiveUsers = mostActiveUsers;
    }

    get mostPopularPolls() {
        return this.#mostPopularPolls;
    }

    get recentPolls() {
        return this.#recentPolls;
    }

    get mostActiveUsers() {
        return this.#mostActiveUsers;
    }

}

export class UserViewModel {

    #id;
    #name;

    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

}

export class MostActiveUser {

    #id;
    #name;
    #image;

    constructor(id, name, image) {
        this.#id = id;
        this.#name = name;
        this.#image = image;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get image() {
    return this.#image;
    }

}

export class PollViewModel {

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