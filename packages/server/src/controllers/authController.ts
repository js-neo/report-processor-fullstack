// packages/server/src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    registerUser,
    loginUser,
    validateToken
} from '../services/authService.js';
import {BadRequestError, UnauthorizedError} from '../errors/errorClasses.js';

export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    console.log({ email, password });

    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }

    const user = await registerUser(email, password);

    res.status(201).json({
        success: true,
        data: {
            email: user.email
        }
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });

    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }

    const { user, accessToken } = await loginUser(email, password);
    console.log( { user, accessToken });


    res.json({
        success: true,
        data: {
            ...user,
            accessToken
        }
    });
});

export const authenticate = asyncHandler(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    const payload = validateToken(token);
    console.log("payload: ", payload);
    req.user = payload;
    next();
});