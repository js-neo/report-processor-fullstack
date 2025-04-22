// packages/client/src/app/auth/register/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signUp } from '@/services/authService';
import { useObjects } from '@/hooks/useReports';
import DynamicDropdown from "@/components/UI/Dropdown/DynamicDropdown";
import { useAuthActions } from "@/stores/appStore";
import { Button } from "@/components/UI/Button";

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [telegramUsername, setTelegramUsername] = useState('');
    const [position, setPosition] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [selectedObject, setSelectedObject] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const { objects, loading: objectsLoading, error: objectsError } = useObjects();
    const { login } = useAuthActions();

    const isFormValid = (
        fullName.trim() !== '' &&
        telegramUsername.trim() !== '' &&
        position.trim() !== '' &&
        phone.trim() !== '' &&
        password.trim() !== '' &&
        selectedObject.trim() !== ''
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        setIsSubmitting(true);
        setError('');

        try {
            const { data } = await signUp({
                fullName,
                telegram_username: telegramUsername,
                position,
                phone,
                password,
                objectRef: selectedObject
            });

            login(data.user, data.accessToken);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка регистрации');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formDisabled = isSubmitting || objectsLoading || !isFormValid;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-gray-100">
                Регистрация
            </h2>

            <form onSubmit={handleSubmit} className={`space-y-6 ${isSubmitting ? 'cursor-wait' : ''}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Полное имя
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isSubmitting || objectsLoading}
                            placeholder="Иванов Иван Иванович"
                            required
                        />
                    </div>

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
                            disabled={isSubmitting || objectsLoading}
                            placeholder="@username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Должность
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            disabled={isSubmitting || objectsLoading}
                            placeholder="Прораб"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Номер телефона
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isSubmitting || objectsLoading}
                            placeholder="89991234567"
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
                            disabled={isSubmitting || objectsLoading}
                            placeholder="Не менее 8 символов"
                            required
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Объект
                        </label>
                        <DynamicDropdown
                            type="object"
                            data={objects}
                            selectedValue={selectedObject}
                            onChange={setSelectedObject}
                            placeholder="Выберите объект"
                            loading={objectsLoading}
                            error={objectsError || undefined}
                        />
                    </div>
                </div>

                {(error || objectsError) && (
                    <div className="space-y-1">
                        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
                        {objectsError && <p className="text-red-500 dark:text-red-400 text-sm text-center">{objectsError}</p>}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isSubmitting}
                    loadingText="Регистрация..."
                    disabled={formDisabled}
                    tooltip="Заполните все обязательные поля"
                >
                    Зарегистрироваться
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Уже есть аккаунт?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/login')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium cursor-pointer"
                        disabled={isSubmitting || objectsLoading}
                    >
                        Войдите здесь
                    </button>
                </p>
            </form>
        </div>
    );
}