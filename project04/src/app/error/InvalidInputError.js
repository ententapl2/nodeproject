export default class InvalidInputError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'InvalidInputError';
        this.details = details;
    }
}