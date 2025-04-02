// packages/server/src/errors/errorClasses.ts

export interface ErrorDetails {
    method?: string;
    path?: string;
    suggestion?: string;
    [key: string]: unknown;
}

export class ApiError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public details?: ErrorDetails
    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized', details?: ErrorDetails) {
        super(message, 401, details);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad Request', details?: ErrorDetails) {
        super(message, 400, details);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found', details?: ErrorDetails) {
        super(message, 404, details);
    }
}

export class DatabaseError extends ApiError {
    constructor(message: string = 'Database Error', details?: ErrorDetails) {
        super(message, 503, details);
    }
}