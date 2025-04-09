// packages/server/src/models/Manager.ts
import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IManagerAuth {
    telegram_username: string;
    passwordHash: string;
    lastLogin?: Date;
}

interface IManagerProfile {
    fullName: string;
    objectId: Types.ObjectId;
    role: 'manager' | 'admin';
}

interface IManager extends Document {
    managerId: string;
    auth: IManagerAuth;
    profile: IManagerProfile;
    created_at: Date;
    updated_at: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const ManagerSchema = new Schema<IManager>(
    {
        managerId: {
            type: String,
            required: [true, 'Manager ID is required'],
            validate: {
                validator: (v: string) => /^[a-z0-9_]{3,30}$/.test(v),
                message: 'Invalid manager ID format (3-30 lowercase letters, numbers and underscores)'
            }
        },
        auth: {
            telegram_username: {
                type: String,
                required: true,
                match: [/^@[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram username format']
            },
            passwordHash: {
                type: String,
                required: true,
                select: false
            },
            lastLogin: {
                type: Date,
                default: null
            }
        },
        profile: {
            fullName: {
                type: String,
                required: true,
                trim: true,
                minlength: 2,
                maxlength: 50
            },
            objectId: {
                type: Schema.Types.ObjectId,
                ref: 'Object',
                required: true,
                validate: {
                    validator: async function(v: Types.ObjectId) {
                        const doc = await model('Object').findById(v);
                        return !!doc;
                    },
                    message: 'Object does not exist'
                }
            },
            role: {
                type: String,
                enum: ['manager', 'admin'],
                default: 'manager'
            }
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function(_, ret) {
                return {
                    managerId: ret.managerId,
                    telegram_username: ret.auth.telegram_username,
                    fullName: ret.profile.fullName,
                    objectId: ret.profile.objectId,
                    role: ret.profile.role,
                    created_at: ret.created_at,
                    updated_at: ret.updated_at
                };
            }
        }
    }
);

// Виртуальное поле для объекта
ManagerSchema.virtual('object', {
    ref: 'Object',
    localField: 'profile.objectId',
    foreignField: '_id',
    justOne: true
});

// Хук для хеширования пароля
ManagerSchema.pre<IManager>('save', async function(next) {
    if (!this.isModified('auth.passwordHash')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.auth.passwordHash = await bcrypt.hash(this.auth.passwordHash, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

// Метод для сравнения паролей
ManagerSchema.methods.comparePassword = async function(
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.auth.passwordHash);
};

// Индексы
ManagerSchema.index({ managerId: 1 }, { unique: true });
ManagerSchema.index({ 'auth.telegram_username': 1 }, { unique: true });
ManagerSchema.index({ 'profile.objectId': 1 });

export { IManager };
export default model<IManager>('Manager', ManagerSchema);