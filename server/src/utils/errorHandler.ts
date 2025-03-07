// server/src/utils/errorHandler.ts

import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { ApiError, NotFoundError } from '../errors/errorClasses.ts';
import { MongooseError } from 'mongoose';

const decodeSafe = (encodedString: string): string => {
    let decoded = encodedString;
    try {
        // Двойное декодирование для случаев двойного кодирования
        decoded = decodeURIComponent(decoded);
        decoded = decodeURIComponent(decoded);
    } catch (e) {
        try {
            decoded = decodeURI(decoded);
        } catch (e) {
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

    const decodedDetails = err instanceof ApiError
        ? Object.entries(err.details || {}).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string' ? decodeSafe(value) : value;
            return acc;
        }, {} as Record<string, any>)
        : undefined;

    const decodedPath = decodeSafe(req.path);
    const decodedUrl = decodeSafe(req.originalUrl);
    const decodedMethod = req.method;

    console.error('🚨 Decoded error details:', {
        message,
        details: decodedDetails,
        path: decodedPath,
        fullUrl: decodedUrl,
        method: decodedMethod,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });

    res.status(statusCode).json({
        success: false,
        message,
        ...(decodedDetails && { details: decodedDetails }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    console.log(`🔍 notFoundHandler: Route ${req.originalUrl} not found`);
    const error = new NotFoundError("Запрашиваемый ресурс не найден", {
        method: req.method,
        path: req.originalUrl,
        suggestion: "Проверьте правильность URL"
    });

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: error.details
    });
};