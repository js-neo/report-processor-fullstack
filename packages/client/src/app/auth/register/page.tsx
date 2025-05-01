// packages/client/src/app/auth/register/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { signUp } from '@/services/authService';
import { useObjects } from '@/hooks/useObject';
import { useAuthActions } from "@/stores/appStore";
import { Button } from "@/components/UI/Button";
import { Select } from "@/components/UI/Select";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            selectedObject: ""
        }
    });

    const phoneValidation = {
        required: 'Номер телефона обязателен',
        validate: (value: string) => {
            const digitsOnly = value.replace(/\D/g, '');
            if (!digitsOnly) return 'Введите номер телефона';
            if (!/^[78]\d{10}$/.test(digitsOnly)) {
                return 'Введите 11-значный номер, начинающийся с +7 или 8';
            }
            return true;
        },
        onChange: () => setSubmitError('')
    };

    const selectedObjectValue = watch('selectedObject');
    const formDisabled = isSubmitting || objectsLoading || !isValid;

    useEffect(() => {
        if (objects.length > 0 && !selectedObjectValue) {
            setValue('selectedObject', objects[0]._id);
        }
    }, [objects, setValue, selectedObjectValue]);

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setSubmitError('');

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
            setSubmitError(err instanceof Error ? err.message : 'Ошибка регистрации');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-gray-100">
                Регистрация
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${isSubmitting ? 'cursor-wait' : ''}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Полное имя
                        </label>
                        <input
                            type="text"
                            placeholder="Иванов Иван Иванович"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isSubmitting || objectsLoading}
                            {...register('fullName', {
                                required: 'Полное имя обязательно',
                                onChange: () => setSubmitError('')
                            })}
                        />
                        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Telegram username
                        </label>
                        <input
                            type="text"
                            placeholder="@username"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isSubmitting || objectsLoading}
                            {...register('telegramUsername', {
                                required: 'Telegram username обязателен',
                                onChange: () => setSubmitError('')
                            })}
                        />
                        {errors.telegramUsername && <p className="text-red-500">{errors.telegramUsername.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Должность
                        </label>
                        <input
                            type="text"
                            placeholder="Прораб"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isSubmitting || objectsLoading}
                            {...register('position', {
                                required: 'Должность обязательна',
                                onChange: () => setSubmitError('')
                            })}
                        />
                        {errors.position && <p className="text-red-500">{errors.position.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Номер телефона
                        </label>
                        <input
                            type="tel"
                            placeholder="89991234567"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isSubmitting || objectsLoading}
                            {...register('phone', phoneValidation)}
                        />
                        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            placeholder="Не менее 8 символов"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            disabled={isSubmitting || objectsLoading}
                            {...register('password', {
                                required: 'Пароль обязателен',
                                minLength: {
                                    value: 8,
                                    message: 'Пароль должен содержать не менее 8 символов'
                                },
                                onChange: () => setSubmitError('')
                            })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Объект
                        </label>
                        {objectsLoading ? (
                            <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                                Загрузка объектов...
                            </div>
                        ) : objectsError ? (
                            <div className="text-red-500 dark:text-red-400">
                                {objectsError}
                            </div>
                        ) : (
                            <Select
                                {...register('selectedObject', {
                                    required: 'Объект обязателен',
                                    onChange: () => setSubmitError('')
                                })}
                                value={selectedObjectValue}
                                onChange={(e) => setValue('selectedObject', e.target.value)}
                                disabled={isSubmitting || objectsLoading}
                            >
                                <option value="" disabled>
                                    Выберите объект
                                </option>
                                {objects
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((object) => (
                                        <option key={object._id} value={object._id}>
                                            {object.name}
                                        </option>
                                    ))}
                            </Select>
                        )}
                        {errors.selectedObject && (
                            <p className="text-red-500">{errors.selectedObject.message}</p>
                        )}
                    </div>
                </div>

                {(submitError || objectsError) && (
                    <div className="space-y-1">
                        {submitError && <p className="text-red-500 dark:text-red-400 text-sm text-center">{submitError}</p>}
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
                    tooltip={!isValid ? "Заполните все обязательные поля" : undefined}
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
