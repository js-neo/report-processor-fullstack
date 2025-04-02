// packages/server/src/errors/authErrors.ts

import { ApiError, ErrorDetails } from './errorClasses.js';

export class InvalidCredentialsError extends ApiError {
    constructor(details?: ErrorDetails) {
        super('Неверные учетные данные', 401, {
            ...details,
            suggestion: 'Проверьте правильность email и пароля'
        });
        this.name = 'InvalidCredentialsError';
    }
}

export class UserNotFoundError extends ApiError {
    constructor(details?: ErrorDetails) {
        super('Пользователь не найден', 404, {
            ...details,
            suggestion: 'Проверьте email или зарегистрируйтесь'
        });
        this.name = 'UserNotFoundError';
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = 'Доступ запрещен', details?: ErrorDetails) {
        super(message, 403, details);
        this.name = 'ForbiddenError';
    }
}

export class TokenExpiredError extends ApiError {
    constructor() {
        super('Срок действия токена истек', 401, {
            suggestion: 'Выполните повторный вход в систему'
        });
        this.name = 'TokenExpiredError';
    }
}

