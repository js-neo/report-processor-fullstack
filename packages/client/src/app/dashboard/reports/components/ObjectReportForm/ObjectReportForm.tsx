// packages/client/src/app/dashboard/reports/components/ObjectReportForm/ObjectReportForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { DatePicker } from '@/components/UI/DatePicker';
import React, {useEffect, useState} from "react";
import {useAuthError, useAuthLoading, useUser} from "@/stores/appStore";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import toast from "react-hot-toast";
import {cn} from "@/utils";

export const ObjectReportForm = ({ gridLayout = false }: { gridLayout?: boolean }) => {
    const user = useUser();
    const loading = useAuthLoading();
    const error = useAuthError();
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [touchedFields, setTouchedFields] = useState({
        startDate: false,
        endDate: false,
        object: false
    });

    const objectId = typeof user?.objectRef === 'object' && user?.objectRef?.objectId;

    const areDatesFilled = !!startDate && !!endDate;
    const areDatesValid = areDatesFilled && new Date(endDate) >= new Date(startDate);
    const isObjectSelected = !!objectId;
    const isFormValid = areDatesValid && isObjectSelected;

    const ERROR_MESSAGES = {
        DATES_REQUIRED: 'Пожалуйста, заполните обе даты',
        DATES_INVALID: 'Конечная дата должна быть позже начальной',
        OBJECT_REQUIRED: 'Объект не выбран',
        OBJECT_NOT_FOUND: 'Выбранный объект не найден',
        LOAD_ERROR: 'Ошибка загрузки данных:'
    };

    const shouldShowError = (field: keyof typeof touchedFields) => {
        return touchedFields[field] && !(field === 'startDate' ? startDate : endDate);
    };

    const handleFieldBlur = (field: keyof typeof touchedFields) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };

    useEffect(() => {
        if (error) {
            toast.error(`${ERROR_MESSAGES.LOAD_ERROR} ${error}`, { duration: 3000 });
        }
    }, [error, ERROR_MESSAGES.LOAD_ERROR]);

    const validateForm = () => {
        setTouchedFields({
            startDate: true,
            endDate: true,
            object: true,
        });

        if (!areDatesFilled) {
            toast.error(ERROR_MESSAGES.DATES_REQUIRED, { duration: 3000 });
            return false;
        }

        if (!areDatesValid) {
            toast.error(ERROR_MESSAGES.DATES_INVALID, { duration: 3000 });
            return false;
        }

        if (!isObjectSelected) {
            toast.error(ERROR_MESSAGES.OBJECT_REQUIRED, { duration: 3000 });
            return false;
        }

        return true;
    };

    const handleGenerate = () => {
         if (!validateForm()) return;

        if (!user?.objectRef?.objectId) {
            toast.error(ERROR_MESSAGES.OBJECT_NOT_FOUND, { duration: 3000 });
            return;
        }

        const baseQuery = `?start=${startDate}&end=${endDate}`;
        const path = `/reports/objects/${objectId}/period${baseQuery}`;
        router.push(path);
    };

    const handleButtonClick = () => {
        if (!isFormValid) {
            validateForm();
        } else {
            handleGenerate();
        }
    };

    if (loading) {
        return (
            <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                <LoadingSpinner small />
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${gridLayout ? 'grid grid-cols-1 gap-6' : ''}`}>
            <div className={`${gridLayout ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                <div>
                    <DatePicker
                        label="Начальная дата"
                        selected={startDate}
                        onChangeAction={setStartDate}
                        onBlur={() => handleFieldBlur('startDate')}
                        hasError={shouldShowError('startDate')}
                        className={shouldShowError('startDate') ? 'animate-pulse' : ''}
                    />
                    {shouldShowError('startDate') && (
                        <p className="mt-1 text-sm text-red-500">{ERROR_MESSAGES.DATES_REQUIRED}</p>
                    )}
                </div>
                <div>
                    <DatePicker
                        label="Конечная дата"
                        selected={endDate}
                        onChangeAction={setEndDate}
                        onBlur={() => handleFieldBlur('endDate')}
                        hasError={shouldShowError('endDate')}
                        className={shouldShowError('endDate') ? 'animate-pulse' : ''}
                    />
                    {shouldShowError('endDate') && (
                        <p className="mt-1 text-sm text-red-500">{ERROR_MESSAGES.DATES_REQUIRED}</p>
                    )}
                    {areDatesFilled && !areDatesValid && (
                        <p className="mt-1 text-sm text-red-500">{ERROR_MESSAGES.DATES_INVALID}</p>
                    )}
                </div>
            </div>
            <div className={gridLayout ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
            <div>
                <label className="block text-sm font-medium mb-2">Объект</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={user?.objectRef && typeof user?.objectRef === 'object' ? user.objectRef.name : 'Объект не указан'}
                    readOnly
                />
                {shouldShowError('object') && (
                    <p className="mt-1 text-sm text-red-500">{ERROR_MESSAGES.OBJECT_REQUIRED}</p>
                )}
            </div>
            </div>

            <div className={gridLayout ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
                <Button
                    variant="primary"
                    onClick={handleButtonClick}
                    className={cn(
                        "w-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        !isFormValid && "opacity-80 cursor-not-allowed hover:opacity-80"
                    )}
                    aria-disabled={!isFormValid}
                    title={!isFormValid ? "Заполните все обязательные поля правильно" : ""}
                >
                    Сгенерировать отчет
                </Button>
            </div>
        </div>
    );
};