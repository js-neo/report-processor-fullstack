import { ErrorRequestHandler, Request, Response } from 'express';
import { ApiError } from '../errors/errorClasses.ts';
import { MongooseError } from 'mongoose';

export const errorHandler: ErrorRequestHandler = (
    err: ApiError | MongooseError | Error,
    req: Request,
    res: Response
) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[${new Date().toISOString()}] ${statusCode} ${req.method} ${req.path}`, {
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        details: err instanceof ApiError ? err.details : undefined
    });

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            ...(err instanceof ApiError && { details: err.details })
        })
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};