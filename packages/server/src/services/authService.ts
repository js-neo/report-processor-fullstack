// server/src/services/authService.ts

import Auth, { IAuth } from '../models/Auth.js';
import {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
} from '../errors/errorClasses.js';
import jwt, { Secret } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const JWT_SECRET: Secret = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

interface LoginResponse {
    user: { email: string };
    accessToken: string;
}

interface TokenPayload {
    userId: string;
    email: string;
}

export const registerUser = async (
    email: string,
    password: string
): Promise<IAuth> => {
    if (!email?.trim() || !password?.trim()) {
        throw new BadRequestError('Email and password are required');
    }

    if (password.length < 8) {
        throw new BadRequestError('Password must be at least 8 characters');
    }

    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('Email already exists');
    }

    const user = new Auth({ email, password });
    return user.save();
};

export const loginUser = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const user = await Auth.findOne({ email }).select('+password');
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const payload: TokenPayload = {
        userId: user.id,
        email: user.email
    };

    const options: jwt.SignOptions = {
        expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    };

    const accessToken = jwt.sign(
        payload,
        JWT_SECRET,
        options
    );

    return {
        user: { email: user.email },
        accessToken
    };
};

export const validateToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        console.log('decoded: ', decoded);
        return decoded;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expired');
        }
        throw new UnauthorizedError('Invalid token');
    }
};