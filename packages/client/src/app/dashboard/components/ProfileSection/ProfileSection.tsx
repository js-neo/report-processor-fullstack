// packages/client/src/app/dashboard/components/ProfileSection/ProfileSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useObjects } from '@/hooks/useReports';
import { Button } from '@/components/UI/Button';
import { Select } from '@/components/UI/Select';

export const ProfileSection = () => {
    const { user, refreshAuth } = useAuth();
    const { objects, loading: objectsLoading } = useObjects();
    const [selectedObject, setSelectedObject] = useState(user?.objectId || '');

    useEffect(() => {
        if (user?.objectId) {
            setSelectedObject(user.objectId);
        }
    }, [user?.objectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ objectId: selectedObject })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка обновления профиля');
            }

            await refreshAuth();
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Профиль руководителя
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Текущий объект
                    </label>
                    <Select
                        value={selectedObject}
                        onChange={(e) => setSelectedObject(e.target.value)}
                        disabled={objectsLoading}
                    >
                        <option value="">Выберите объект</option>
                        {objects.map((obj) => (
                            <option key={obj._id} value={obj._id}>
                                {obj.name}
                            </option>
                        ))}
                    </Select>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!selectedObject || objectsLoading}
                    >
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </div>
    );
};