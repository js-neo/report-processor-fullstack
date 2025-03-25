// server/src/services/authService.ts
import Auth from '../models/Auth.js';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../errors/errorClasses.js';
import jwt from 'jsonwebtoken';
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const registerUser = async (email, password) => {
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
export const loginUser = async (email, password) => {
    const user = await Auth.findOne({ email }).select('+password');
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
    }
    const payload = {
        userId: user.id,
        email: user.email
    };
    const options = {
        expiresIn: JWT_EXPIRES_IN
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, options);
    return {
        user: { email: user.email },
        accessToken
    };
};
export const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('decoded: ', decoded);
        return decoded;
    }
    catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token expired');
        }
        throw new UnauthorizedError('Invalid token');
    }
};
//# sourceMappingURL=authService.js.map