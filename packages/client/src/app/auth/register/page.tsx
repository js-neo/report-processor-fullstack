// packages/client/src/app/auth/register/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { signUp } from '@/services/authService';
import { useObjects } from '@/hooks/useReports';
import DynamicDropdown from "@/components/UI/Dropdown/DynamicDropdown";
import { useAuthActions } from "@/stores/appStore";
import { Button } from "@/components/UI/Button";

type FormData = {
    fullName: string;
    telegramUsername: string;
    position: string;
    phone: string;
    password: string;
    selectedObject: string;
};

export default function RegisterPage() {
    const router = useRouter();
    const { objects, loading: objectsLoading, error: objectsError } = useObjects();
    const { login } = useAuthActions();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            const { data: responseData } = await signUp({
                fullName: data.fullName,
                telegram_username: data.telegramUsername,
                position: data.position,
                phone: data.phone,
                password: data.password,
                objectRef: data.selectedObject
            });

            login(responseData.user, responseData.accessToken);
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-gray-100">
                Регистрация
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Полное имя
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...register('fullName', { required: 'Полное имя обязательно' })}
                        />
                        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Telegram username
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...register('telegramUsername', { required: 'Telegram username обязателен' })}
                        />
                        {errors.telegramUsername && <p className="text-red-500">{errors.telegramUsername.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Должность
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...register('position', { required: 'Должность обязательна' })}
                        />
                        {errors.position && <p className="text-red-500">{errors.position.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Номер телефона
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...register('phone', { required: 'Номер телефона обязателен' })}
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            {...register('password', { required: 'Пароль обязателен', minLength: { value: 8, message: 'Пароль должен содержать не менее 8 символов' } })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Объект
                        </label>
                        <DynamicDropdown
                            type="object"
                            data={objects}
                            selectedValue=""
                            onChange={(value) => setValue('selectedObject', value)} // Устанавливаем значение поля selectedObject
                            placeholder="Выберите объект"
                            loading={objectsLoading}
                            error={objectsError || undefined}
                        />
                        {errors.selectedObject && <p className="text-red-500">{errors.selectedObject.message}</p>}
                    </div>
                </div>

                {objectsError && (
                    <div className="space-y-1">
                        <p className="text-red-500 dark:text-red-400 text-sm text-center">{objectsError}</p>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={objectsLoading}
                >
                    Зарегистрироваться
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Уже есть аккаунт?{' '}
                    <button
                        type="button"
                        onClick={() => router.push('/auth/login')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium cursor-pointer"
                        disabled={objectsLoading}
                    >
                        Войдите здесь
                    </button>
                </p>
            </form>
        </div>
    );
}
