// packages/client/src/app/dashboard/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/UI/Button';
import { useAuthState } from '@/stores/appStore';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { CreateWorkerForm } from './components/CreateWorkerForm';
import { UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import {CreateObjectForm} from "@/app/dashboard/create/components/CreateObjectForm";

export default function CreatePage() {
    const [activeTab, setActiveTab] = useState<'worker' | 'object'>('worker');
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
    const { user } = useAuthState();
    const router = useRouter();

    useEffect(() => {
        if (user?.role !== 'admin') {
            router.push('/dashboard');
        } else {
            setIsAllowed(true);
        }
    }, [user, router]);

    if (isAllowed === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAllowed) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Создание
                </h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    Назад
                </Button>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('worker')}
                    className={`flex items-center justify-center flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                        activeTab === 'worker'
                            ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    <UserIcon className="w-5 h-5 mr-2" />
                    Сотрудник
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('object')}
                    className={`flex items-center justify-center flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                        activeTab === 'object'
                            ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                    Объект
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 transition-all duration-200">
                {activeTab === 'worker' && <CreateWorkerForm />}
                {activeTab === 'object' && <CreateObjectForm />}
            </div>
        </div>
    );
}