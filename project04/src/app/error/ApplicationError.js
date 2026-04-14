export default class ApplicationError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'ApplicationError';
        this.details = details;
    }
}