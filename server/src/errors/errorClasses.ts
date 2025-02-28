export class ApiError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public details?: object
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad Request', details?: object) {
        super(message, 400, details);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found', details?: object) {
        super(message, 404, details);
    }
}

export class DatabaseError extends ApiError {
    constructor(message: string = 'Database Error', details?: object) {
        super(message, 503, details);
    }
}