import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ApiError, ErrorDetails, NotFoundError } from '../errors/errorClasses.ts';
import {
    InvalidCredentialsError,
    UserNotFoundError,
    TokenExpiredError
} from '../errors/authErrors.ts';
import { MongooseError } from 'mongoose';

const decodeSafe = (encodedString: string): string => {
    let decoded = encodedString;
    try {
        decoded = decodeURIComponent(decodeURIComponent(decoded));
    } catch {
        try {
            decoded = decodeURI(decoded);
        } catch {
            return encodedString;
        }
    }
    return decoded;
};

export const errorHandler: ErrorRequestHandler = (
    err: ApiError | MongooseError | Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    const decodedDetails = err instanceof ApiError && err.details
        ? Object.entries(err.details).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string' ? decodeSafe(value) : value;
            return acc;
        }, {} as ErrorDetails)
        : undefined;

    console.error('🚨 Error Handler:', {
        timestamp: new Date().toISOString(),
        statusCode,
        message,
        path: decodeSafe(req.path),
        method: req.method,
        details: decodedDetails,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });

    if (err instanceof InvalidCredentialsError) {
        res.status(statusCode).json({
            success: false,
            code: 'INVALID_CREDENTIALS',
            message,
            details: decodedDetails,
            suggestion: 'Проверьте email и пароль'
        });
        return;
    }

    if (err instanceof UserNotFoundError) {
        res.status(statusCode).json({
            success: false,
            code: 'USER_NOT_FOUND',
            message,
            details: decodedDetails,
            suggestion: 'Зарегистрируйтесь'
        });
        return;
    }

    if (err instanceof TokenExpiredError) {
        res.status(statusCode).json({
            success: false,
            code: 'TOKEN_EXPIRED',
            message,
            details: decodedDetails,
            suggestion: 'Выполните повторный вход'
        });
        return;
    }

    res.status(statusCode).json({
        success: false,
        code: err instanceof ApiError ? 'API_ERROR' : 'INTERNAL_ERROR',
        message,
        ...(decodedDetails && { details: decodedDetails }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    const error = new NotFoundError("Ресурс не найден", {
        method: req.method,
        path: decodeSafe(req.originalUrl),
        suggestion: "Проверьте URL"
    });

    console.warn('⚠️ Not Found:', {
        path: error.details?.path,
        method: error.details?.method
    });

    res.status(error.statusCode).json({
        success: false,
        code: 'NOT_FOUND',
        message: error.message,
        details: error.details
    });
};