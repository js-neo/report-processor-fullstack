// packages/server/src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    registerManager,
    loginManager,
    validateToken
} from '../services/authService.js';
import Manager from '../models/Manager.js';
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} from '../errors/errorClasses.js';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    console.log("GET_ME")
    const manager = await Manager.findOne({ managerId: req.user.managerId })
        .populate('profile.objectRef')
        .select('managerId auth.telegram_username profile.fullName profile.position profile.phone profile.objectRef profile.role');
    if (!manager) {
        throw new NotFoundError('Manager not found');
    }

    res.json({
        success: true,
        data: {
            managerId: manager.managerId,
            fullName: manager.profile.fullName,
            telegram_username: manager.auth.telegram_username,
            position: manager.profile.position,
            phone: manager.profile.phone,
            objectRef: manager.profile.objectRef,
            role: manager.profile.role
        }
    });
});

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, telegram_username, position, phone, password, objectRef } = req.body;

    if (!fullName?.trim() || !telegram_username?.trim() || !position.trim() || !phone.trim() || !password?.trim() || !objectRef?.trim()) {
        throw new BadRequestError('All fields are required');
    }

    const { manager, accessToken } = await registerManager(
        fullName,
        telegram_username,
        position,
        phone,
        password,
        objectRef
    );

    console.log("manager_controller: ", manager);

    res.status(201).json({
        success: true,
        data: {
            ...manager,
            accessToken
        }
    });
});


export const login = asyncHandler(async (req: Request, res: Response) => {
    const { telegram_username, password } = req.body;
    console.log("telegram_username: ", telegram_username, "password: ", password);
    console.log("req.body: ", req.body);

    if (!telegram_username?.trim() || !password?.trim()) {
        throw new BadRequestError('Telegram username and password are required');
    }

    const { manager, accessToken } = await loginManager(telegram_username, password);
    console.log("login_manager: ", manager);

    res.json({
        success: true,
        data: {
            ...manager,
            accessToken
        }
    });
});

export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = validateToken(token);
        console.log("req.user: ", req.user);
        next();
    } catch (err) {
        throw new UnauthorizedError('Invalid or expired token');
    }
});