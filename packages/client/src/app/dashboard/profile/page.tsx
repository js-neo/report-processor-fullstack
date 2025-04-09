// packages/client/src/app/dashboard/profile/page.tsx
'use client';

import {useAuth} from "@/hooks/useAuth";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Профиль</h1>
            <div className="space-y-4">
                <p><strong>ФИО:</strong> {user?.fullName}</p>
                <p><strong>Telegram:</strong> {user?.telegram_username}</p>
                <p><strong>Роль:</strong> {user?.role === 'admin' ? 'Администратор' : 'Менеджер'}</p>
                {user?.objectId && (
                    <div>
                        <h2 className="text-xl font-semibold mt-6">Объект</h2>
                        <p><strong>Название:</strong> {user.objectId.name}</p>
                        <p><strong>Адрес:</strong> {user.objectId.address}</p>
                    </div>
                )}
            </div>
        </div>
    );
}