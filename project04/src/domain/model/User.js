export default class User {

    #id;
    #name;
    #password;

    constructor(
        id,
        name,
        password
    ) {
        this.#id = id;
        this.#name = name;
        this.#password = password;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get password() {
        return this.#password;
    }

}