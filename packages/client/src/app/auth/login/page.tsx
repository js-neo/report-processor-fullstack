// packages/client/src/app/auth/login/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signIn } from '@/services/authService';
import {useStore} from "@/stores/appStore";

export default function LoginPage() {
    const [telegramUsername, setTelegramUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const {login} = useStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn({
                telegram_username: telegramUsername,
                password
            }, login);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Неверные учетные данные');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-gray-100">
                Авторизация
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Telegram username
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={telegramUsername}
                            onChange={(e) => setTelegramUsername(e.target.value)}
                            placeholder="@username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Войти
                </button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Нет аккаунта?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/register')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Зарегистрируйтесь
                    </button>
                </p>
            </form>
        </div>
    );
}