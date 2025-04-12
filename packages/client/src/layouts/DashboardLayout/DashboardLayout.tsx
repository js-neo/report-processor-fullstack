// packages/client/src/layouts/DashboardLayout/DashboardLayout.tsx

'use client';

import { usePathname, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import React, { useEffect } from "react";
import {useAuthState, useIsAuthenticated} from "@/stores/appStore";

const tabs = [
    { id: 'profile', label: 'Профиль', path: '/dashboard/profile' },
    { id: 'employees', label: 'Сотрудники', path: '/dashboard/workers' },
    { id: 'reports', label: 'Отчеты', path: '/dashboard/reports' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading: authLoading, error } = useAuthState();
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const activeTab = tabs.find(tab => pathname.startsWith(tab.path))?.id || 'profile';

    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 text-lg p-4 border rounded-lg">
                    {error}
                </p>
            </div>
        );
    }

    if (!user) return null;

    const getObjectName = () => {
        if (!user.objectRef) return 'Не назначен';

        if (typeof user.objectRef === 'object' && 'name' in user.objectRef) {
            return user.objectRef.name;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Личный кабинет</h1>
                    <div className="text-right">
                        <p className="text-lg font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500">
                            Объект: {getObjectName()}
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <nav className="w-64">
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.path}
                                    className={cn(
                                        'block w-full px-4 py-2 rounded-lg',
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    )}
                                >
                                    {tab.label}
                                </Link>
                            ))}
                        </div>
                    </nav>

                    <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};