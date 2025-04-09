// packages/shared/src/types/manager.ts

import { Document } from 'mongoose';

interface IManagerAuth {
    telegram_username: string;
    passwordHash: string;
    lastLogin?: Date;
}

interface IManagerObject {
    name: string;
    address: string;
    coordinates: string;
    created_at: string;
    updated_at: string;
}


interface IManagerProfile {
    fullName: string;
    objectId: IManagerObject | null;
    role: 'manager' | 'admin';
}

export interface IManagerBase {
    managerId: string;
    auth: IManagerAuth;
    profile: IManagerProfile;
    created_at: Date;
    updated_at: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IManager extends IManagerBase, Document {}

export type ClientManager = Pick<IManagerBase, 'managerId'> & {
    fullName: string;
    telegram_username: string;
    objectId: IManagerObject | null;
    role: 'manager' | 'admin';
};