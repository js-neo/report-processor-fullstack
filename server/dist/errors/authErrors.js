// server/src/errors/authErrors.ts
import { ApiError } from './errorClasses.js';
export class InvalidCredentialsError extends ApiError {
    constructor(details) {
        super('Неверные учетные данные', 401, {
            ...details,
            suggestion: 'Проверьте правильность email и пароля'
        });
        this.name = 'InvalidCredentialsError';
    }
}
export class UserNotFoundError extends ApiError {
    constructor(details) {
        super('Пользователь не найден', 404, {
            ...details,
            suggestion: 'Проверьте email или зарегистрируйтесь'
        });
        this.name = 'UserNotFoundError';
    }
}
export class ForbiddenError extends ApiError {
    constructor(message = 'Доступ запрещен', details) {
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
//# sourceMappingURL=authErrors.js.map