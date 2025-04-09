// packages/server/src/services/authService.ts

import Manager, {IManager} from '../models/Manager.js';
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} from '../errors/errorClasses.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import {generateBaseId_2, getUniqueId} from "shared";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

interface AuthResponse {
    manager: {
        managerId: string;
        fullName: string;
        telegram_username: string;
        objectId: ObjectId;
        role: string;
    };
    accessToken: string;
}

interface TokenPayload {
    managerId: string;
    telegram_username: string;
    role: string;
}

const getJwtOptions = (): jwt.SignOptions => ({
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
});

const createTokenPayload = (manager: IManager): TokenPayload => ({
    managerId: manager.managerId,
    telegram_username: manager.auth.telegram_username,
    role: manager.profile.role
});

const formatAuthResponse = (manager: IManager, accessToken: string): AuthResponse => ({
    manager: {
        managerId: manager.managerId,
        fullName: manager.profile.fullName,
        telegram_username: manager.auth.telegram_username,
        objectId: manager.profile.objectId,
        role: manager.profile.role
    },
    accessToken
});

export const registerManager = async (
    fullName: string,
    telegram_username: string,
    password: string,
    objectId: string
): Promise<AuthResponse> => {
    if (password.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
    }

    const existingManager = await Manager.findOne({
        'auth.telegram_username': telegram_username
    });

    if (existingManager) {
        throw new BadRequestError('Telegram username already exists');
    }

    const baseId = generateBaseId_2(fullName);

    const managerId = await getUniqueId(baseId, Manager, "managerId");

    const manager = new Manager({
        managerId,
        auth: {
            telegram_username,
            passwordHash: password
        },
        profile: {
            fullName,
            objectId: new ObjectId(objectId),
            role: 'manager'
        }
    });

    await manager.save();

    const payload = createTokenPayload(manager);
    const accessToken = jwt.sign(payload, JWT_SECRET, getJwtOptions());

    return formatAuthResponse(manager, accessToken);
};


export const loginManager = async (
    telegram_username: string,
    password: string
): Promise<AuthResponse> => {
    const manager = await Manager.findOne({
        'auth.telegram_username': telegram_username
    }).select('+auth.passwordHash');

    if (!manager) {
        throw new NotFoundError('Manager not found');
    }

    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const payload = createTokenPayload(manager);
    const accessToken = jwt.sign(payload, JWT_SECRET, getJwtOptions());

    return formatAuthResponse(manager, accessToken);
};

export const validateToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expired');
        }
        throw new UnauthorizedError('Invalid token');
    }
};