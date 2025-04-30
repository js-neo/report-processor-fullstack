// packages/client/src/app/dashboard/create/components/CreateObjectForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { objectService } from '@/services/objectService';
import { toast } from 'react-hot-toast';
import {cn} from "@/utils";
import { useRouter } from 'next/navigation';

type FormData = {
    name: string;
    address: string;
};

export function CreateObjectForm({ onSuccess }: { onSuccess?: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting  }, reset } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        try {
            await objectService.createObject(data);
            toast.success('Объект успешно создан');
            reset();

            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/dashboard');
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Ошибка создания объекта');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Название
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
                    Адрес
                </label>
                <div className="space-y-1">
                    <Input
                        {...register('address', {
                            required: 'Обязательное поле',
                            minLength: {
                                value: 2,
                                message: 'Минимум 2 символа'
                            }
                        })}
                        className={cn(
                            errors.address && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        )}
                    />
                    {errors.address?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {errors.address.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-2 pt-2">
            <Button
                type="submit"
                className="mt-4"
                isLoading={isSubmitting}
                    >
                Создать объект
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
