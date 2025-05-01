// packages/server/src/services/authService.ts

import Manager, {IManager} from '../models/Manager.js';
import {IObject} from "shared"
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} from '../errors/errorClasses.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import {generateBaseId, getUniqueId} from "shared";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

interface AuthResponse {
    manager: {
        managerId: string;
        fullName: string;
        telegram_username: string;
        position: string;
        phone: string;
        objectRef: IObject | ObjectId;
        role: string;
    };
    accessToken: string;
}

interface TokenPayload {
    managerId: string;
    telegram_username: string;
    position: string;
    phone: string;
    role: string;
}

export const normalizePhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
        throw new BadRequestError('Номер должен содержать 11 цифр');
    }
    if (!/^[78]/.test(digitsOnly)) {
        throw new BadRequestError('Номер должен начинаться с 7 или 8');
    }
    return digitsOnly.startsWith('7') ? '8' + digitsOnly.slice(1) : digitsOnly;
};

const getJwtOptions = (): jwt.SignOptions => ({
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
});

const createTokenPayload = (manager: IManager): TokenPayload => ({
    managerId: manager.managerId,
    telegram_username: manager.auth.telegram_username,
    position: manager.profile.position,
    phone: manager.profile.phone,
    role: manager.profile.role
});

const formatAuthResponse = (manager: IManager, accessToken: string): AuthResponse => ({
    manager: {
        managerId: manager.managerId,
        fullName: manager.profile.fullName,
        telegram_username: manager.auth.telegram_username,
        position: manager.profile.position,
        phone: manager.profile.phone,
        objectRef: manager.profile.objectRef,
        role: manager.profile.role
    },
    accessToken
});

export const registerManager = async (
    fullName: string,
    telegram_username: string,
    position: string,
    phone: string,
    password: string,
    objectRef: string
): Promise<AuthResponse> => {
    const normalizedUsername = telegram_username.replace(/^@/, '');
    const normalizedPhone = normalizePhoneNumber(phone);

    if (password.length < 8) {
        throw new BadRequestError('Пароль должен быть не менее 8 символов');
    }

    const [existingManager, existingPhone] = await Promise.all([
        Manager.findOne({ 'auth.telegram_username': normalizedUsername }),
        Manager.findOne({ 'profile.phone': normalizedPhone })
    ]);

    if (existingManager) {
        throw new BadRequestError('Имя пользователя телеграмм уже используется');
    }
    if (existingPhone) {
        throw new BadRequestError('Номер телефона уже зарегистрирован');
    }

    const baseId = generateBaseId(fullName);
    const managerId = await getUniqueId(baseId, Manager, "managerId");

    const manager = new Manager({
        managerId,
        auth: {
            telegram_username: normalizedUsername,
            passwordHash: password,
            telegram_id: ""
        },
        profile: {
            fullName,
            position,
            phone: normalizedPhone,
            objectRef: new ObjectId(objectRef),
            role: 'manager'
        }
    });

    console.log("manager_service: ", manager);

    await manager.save();
    const populateManager = await Manager.findOne({_id: manager._id})
        .populate("profile.objectRef")
        .exec();

    console.log("populateManager_service: ", populateManager);

    if (!populateManager) {
        throw new BadRequestError('Не удалось заполнить экземпляр руководителя после регистрации');
    }

    const payload = createTokenPayload(populateManager);
    const accessToken = jwt.sign(payload, JWT_SECRET, getJwtOptions());

    return formatAuthResponse(populateManager, accessToken);
};


export const loginManager = async (
    telegram_username: string,
    password: string
): Promise<AuthResponse> => {
    const normalizedUsername = telegram_username.replace(/^@/, '');
    const manager = await Manager.findOne({
        'auth.telegram_username': normalizedUsername
    }).populate('profile.objectRef').select('+auth.passwordHash');

    if (!manager) {
        throw new NotFoundError('Руководитель не найден');
    }

    const isMatch = await manager.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedError('Неверные учетные данные');
    }

    const payload = createTokenPayload(manager);
    const accessToken = jwt.sign(payload, JWT_SECRET, getJwtOptions());

    const formatResponse = formatAuthResponse(manager, accessToken)
    console.log(formatResponse);
    return formatResponse;
};

export const validateToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Токен истек');
        }
        throw new UnauthorizedError('Недействительный токен');
    }
};