export default class ErrorViewModel {
    
    #message;
    #code;

    constructor(message, code) {
        this.#message = message;
        this.#code = code;
    }

    get message() {
        return this.#message;
    }

    get code() {
        return this.#code;
    }

}