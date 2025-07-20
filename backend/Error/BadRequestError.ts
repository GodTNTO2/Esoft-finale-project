export class BadRequestError extends Error {
    public readonly statusCode: number = 400;
    public readonly name: string = 'BadRequestError';
    public readonly details?: any;

    constructor(message: string, details?: any) {
        super(message);
        this.details = details;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
            stack: this.stack
        };
    }
}