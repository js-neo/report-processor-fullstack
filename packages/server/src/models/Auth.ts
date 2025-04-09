// packages/server/src/models/Auth.ts

/*
import { Document, Schema, Types, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';


interface IAuth extends Document {
    email: string;
    password: string;
    name: string;
    role: 'manager' | 'admin';
    managedObjects: Types.ObjectId[]; // Массив объектов вместо одного
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IAuthMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AuthSchema = new Schema<IAuth, Model<IAuth, {}, IAuthMethods>>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    }
});

AuthSchema.pre<IAuth>('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

AuthSchema.methods.comparePassword = async function(
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const Auth: Model<IAuth> = model<IAuth>('Auth', AuthSchema);
export default Auth;*/
