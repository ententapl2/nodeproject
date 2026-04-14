export default class UnauthorizedError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'UnauthorizedError';
        this.details = details;
    }
}