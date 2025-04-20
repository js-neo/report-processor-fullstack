// packages/client/src/app/dashboard/components/ProfileSection/ProfileSection.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useObjects } from '@/hooks/useReports';
import { Button } from '@/components/UI/Button';
import { Select } from '@/components/UI/Select';
import {useUser, useAuthActions} from "@/stores/appStore";

export const ProfileSection = () => {
    const user = useUser();
    const {refreshUser} = useAuthActions();
    const { objects, loading: objectsLoading } = useObjects();
    const [selectedObjectId, setSelectedObjectId] = useState(user?.objectRef?._id || '');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user?.objectRef?._id && user.objectRef._id !== selectedObjectId) {
            setSelectedObjectId(user.objectRef._id);
        }
    }, [user?.objectRef?._id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Sending PATCH request to /api/profile', {
                selectedObjectId,
                token: localStorage.getItem('accessToken')
            });

            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ _id: selectedObjectId })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const error = await response.text();
                console.error('Error response:', error);
                throw new Error(error || 'Ошибка обновления профиля');
            }

            const data = await response.json();
            console.log('Success response:', data);
            await refreshUser();
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error('Full error:', error);
            if (error instanceof Error) {
                console.error('Error stack:', error.stack);
            }
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
                        value={selectedObjectId}
                        onChange={(e) => setSelectedObjectId(e.target.value)}
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

                <div className="flex justify-end items-center gap-4">
                    {isSaved && (
                        <span className="text-green-600 dark:text-green-400">
                            Изменения сохранены!
                        </span>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!selectedObjectId || objectsLoading}
                    >
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </div>
    );
};