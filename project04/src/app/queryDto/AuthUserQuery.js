export default class AuthUserQuery {

    #id;
    #name;
    #password;
    #roles;

    constructor(
        id, 
        name,
        password,
        roles
    ) {
        this.#id =id;
        this.#name = name;
        this.#password = password;
        this.#roles = roles;
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

    get roles() {
        return this.#roles;
    }

}