// packages/client/src/app/dashboard/create/components/CreateWorkerForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { useObjects } from '@/hooks/useReports';
import { toast } from 'react-hot-toast';
import { cn } from "@/utils";
import { useRouter } from 'next/navigation';
import { workerService } from '@/services/workerService';

type FormData = {
    name: string;
    position: string;
    salary_rate: number;
    objectId?: string;
    telegram_username: string;
};

export function CreateWorkerForm({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormData>();

    const { objects, loading: objectsLoading } = useObjects();

    const onSubmit = async (data: FormData) => {
        try {
            await workerService.createWorker({
                name: data.name,
                position: data.position,
                salary_rate: data.salary_rate,
                objectRef: data.objectId || null,
                telegram_username: data.telegram_username
            });

            toast.success('Сотрудник успешно создан');
            reset();

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/dashboard/workers');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка создания сотрудника');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ФИО
                </label>
                <div className="space-y-1">
                    <Input
                        {...register('name', {
                            required: 'Обязательное поле',
                            minLength: {
                                value: 3,
                                message: 'Минимум 3 символа'
                            }
                        })}
                        className={cn(
                            errors.name && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                    />
                    {errors.name?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.name.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Телеграм username
                </label>
                <div className="space-y-1">
                    <Input
                        placeholder="@username"
                        {...register('telegram_username', {
                            required: 'Обязательное поле',
                            pattern: {
                                value: /^@?[a-zA-Z0-9_]{5,32}$/,
                                message: 'Должен содержать 5-32 символов (a-z, 0-9, _), символ @ опционален'
                            }
                        })}
                        className={cn(
                            errors.telegram_username && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                    />
                    {errors.telegram_username?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.telegram_username.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Должность
                </label>
                <div className="space-y-1">
                    <Input
                        {...register('position', {
                            required: 'Обязательное поле',
                            minLength: {
                                value: 2,
                                message: 'Минимум 2 символа'
                            }
                        })}
                        className={cn(
                            errors.position && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                    />
                    {errors.position?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.position.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ставка (руб/час)
                </label>
                <div className="space-y-1">
                    <Input
                        type="number"
                        step="0.01"
                        min="1"
                        {...register('salary_rate', {
                            required: 'Обязательное поле',
                            min: {
                                value: 1,
                                message: 'Минимальная ставка 1 рубль'
                            },
                            max: {
                                value: 10000,
                                message: 'Максимальная ставка 10,000 рублей'
                            }
                        })}
                        className={cn(
                            errors.salary_rate && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                    />
                    {errors.salary_rate?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.salary_rate.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Объект (необязательно)
                </label>
                <select
                    {...register('objectId')}
                    className={cn(
                        "w-full p-2 border rounded-md bg-white dark:bg-gray-700",
                        "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                        "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
                        "disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    )}
                    disabled={objectsLoading}
                    defaultValue=""
                >
                    <option value="">Не назначен</option>
                    {objects.map(obj => (
                        <option key={obj._id} value={obj._id}>
                            {obj.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-2 pt-2">
                <Button
                    type="submit"
                    isLoading={isSubmitting || objectsLoading}
                >
                    Создать сотрудника
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Отмена
                </Button>
            </div>
        </form>
    );
}