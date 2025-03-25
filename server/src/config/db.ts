// server/src/config/db.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DatabaseError } from '../errors/errorClasses.js';

declare global {
    interface Error {
        code?: string | number;
    }
}

dotenv.config();

const connectDB = async (): Promise<void> => {
    if (!process.env.MONGODB_URI) {
        throw new DatabaseError('MongoDB connection URI not configured', {
            envVariable: 'MONGODB_URI'
        });
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅  MongoDB connected');
    } catch (error: unknown) {
        let errorCode = 'UNKNOWN_ERROR';
        let errorMessage = 'Unknown database error';

        if (error instanceof Error) {
            errorMessage = error.message;

            errorCode = error.code !== undefined
                ? String(error.code)
                : errorCode;
        }

        throw new DatabaseError(errorMessage, {
            errorCode,
            details: error instanceof Error ? error.stack : undefined
        });
    }
};

export default connectDB;