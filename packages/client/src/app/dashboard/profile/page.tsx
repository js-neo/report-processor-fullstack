// packages/client/src/app/dashboard/profile/page.tsx
'use client';

import {ProfileSection} from "@/app/dashboard/components/ProfileSection/ProfileSection";
import {useUser} from "@/stores/appStore";

export default function ProfilePage() {
    const user = useUser();
    console.log("user_ProfilePage: ", user);

    return (
        <div>
            <ProfileSection />
            <h1 className="text-2xl font-bold mb-4">Профиль</h1>
            <div className="space-y-4">
                <p><strong>ФИО:</strong> {user?.fullName}</p>
                <p><strong>Telegram:</strong> {user?.telegram_username}</p>
                <p><strong>Роль:</strong> {user?.role === 'admin' ? 'Администратор' : 'Менеджер'}</p>
                {user?.objectRef && (
                    <div>
                        <h2 className="text-xl font-semibold mt-6">Объект</h2>
                        <p><strong>Название:</strong> {user.objectRef.name}</p>
                        <p><strong>Адрес:</strong> {user.objectRef.address}</p>
                    </div>
                )}
            </div>
        </div>
    );
}