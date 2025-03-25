// server/src/errors/errorClasses.ts
export class ApiError extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized', details) {
        super(message, 401, details);
    }
}
export class BadRequestError extends ApiError {
    constructor(message = 'Bad Request', details) {
        super(message, 400, details);
    }
}
export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found', details) {
        super(message, 404, details);
    }
}
export class DatabaseError extends ApiError {
    constructor(message = 'Database Error', details) {
        super(message, 503, details);
    }
}
//# sourceMappingURL=errorClasses.js.map