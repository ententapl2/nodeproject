export default class ConflictError extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'ConflictError';
        this.details = details;
    }
}