// packages/shared/src/types/auth.ts
export interface AuthResponse {
    _id: string;
    email: string;
    name: string;
    role: 'manager' | 'admin';
    assignedObject?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
    objectId: string;
}

export interface AuthUser {
    _id: string;
    email: string;
    name: string;
    role: 'manager' | 'admin';
    assignedObject?: string;
}