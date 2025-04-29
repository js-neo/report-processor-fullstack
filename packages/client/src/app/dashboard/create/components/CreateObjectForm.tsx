/*
// packages/client/src/app/dashboard/create/components/CreateObjectForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { createObject } from '@/services/objectService';
import { toast } from 'react-hot-toast';

type FormData = {
    name: string;
    address: string;
};

export function CreateObjectForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            await createObject(data);
            toast.success('Объект успешно создан');
            reset();
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
                <Input
                    {...register('name', { required: 'Обязательное поле' })}
                    error={errors.name}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Адрес
                </label>
                <Input
                    {...register('address', { required: 'Обязательное поле' })}
                    error={errors.address}
                />
            </div>

            <Button
                type="submit"
                className="mt-4"
            >
                Создать объект
            </Button>
        </form>
    );
}*/
