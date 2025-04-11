// packages/shared/src/types/manager.ts


import {IObject} from "./object.js";

interface IManagerAuth {
    telegram_username: string;
    passwordHash: string;
    lastLogin?: Date;
}


interface IManagerProfile {
    fullName: string;
    objectRef: IObject| null;
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

export type ClientManager = Pick<IManagerBase, 'managerId'> & {
    fullName: string;
    telegram_username: string;
    objectRef: IObject| null;
    role: 'manager' | 'admin';
};