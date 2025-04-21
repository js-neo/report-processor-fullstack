// packages/client/src/app/dashboard/reports/components/EmployeeReportForm/EmployeeReportForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useWorkers } from '@/hooks/useWorkers';
import { Button } from '@/components/UI/Button';
import { DatePicker } from '@/components/UI/DatePicker';
import { Select } from '@/components/UI/Select';
import React, { useMemo, useState, useEffect } from 'react';
import { IWorker } from 'shared';
import { useUser } from '@/stores/appStore';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import toast from 'react-hot-toast';
import {cn} from "@/utils";

const ERROR_MESSAGES = {
    DATES_REQUIRED: 'Пожалуйста, заполните обе даты',
    DATES_INVALID: 'Конечная дата должна быть позже начальной',
    WORKER_REQUIRED: 'Пожалуйста, выберите сотрудника',
    WORKER_NOT_FOUND: 'Выбранный сотрудник не найден',
    LOAD_ERROR: 'Ошибка загрузки сотрудников:'
};

export const EmployeeReportForm = ({ gridLayout = false }: { gridLayout?: boolean }) => {
    const user = useUser();
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedWorker, setSelectedWorker] = useState('');
    const { workers: { assignedToThisObject: data }, loading, error } = useWorkers(user?.objectRef?._id);

    const [touchedFields, setTouchedFields] = useState({
        startDate: false,
        endDate: false,
        worker: false
    });

    const areDatesFilled = !!startDate && !!endDate;
    const areDatesValid = areDatesFilled && new Date(endDate) >= new Date(startDate);
    const isWorkerSelected = !!selectedWorker;
    const isFormValid = areDatesValid && isWorkerSelected;

    const shouldShowError = (field: keyof typeof touchedFields) => {
        return touchedFields[field] && !(field === 'startDate' ? startDate :
            field === 'endDate' ? endDate :
                selectedWorker);
    };

    const handleFieldBlur = (field: keyof typeof touchedFields) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };

    useEffect(() => {
        if (error) {
            toast.error(`${ERROR_MESSAGES.LOAD_ERROR} ${error}`, { duration: 3000 });
        }
    }, [error]);

    const sortedData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];
        return ([...data] as IWorker[]).sort((a, b) =>
            (a.name || '').localeCompare(b.name || '', 'ru'));
    }, [data]);

    const validateForm = () => {
        setTouchedFields({
            startDate: true,
            endDate: true,
            worker: true
        });

        if (!areDatesFilled) {
            toast.error(ERROR_MESSAGES.DATES_REQUIRED, { duration: 3000 });
            return false;
        }

        if (!areDatesValid) {
            toast.error(ERROR_MESSAGES.DATES_INVALID, { duration: 3000 });
            return false;
        }

        if (!isWorkerSelected) {
            toast.error(ERROR_MESSAGES.WORKER_REQUIRED, { duration: 3000 });
            return false;
        }

        return true;
    };

    const handleGenerate = () => {
        if (!validateForm()) return;

        const worker = data.find(w => {
            return w.workerId === selectedWorker
        });

        if (!worker) {
            toast.error(ERROR_MESSAGES.WORKER_NOT_FOUND, { duration: 3000 });
            return;
        }

        const baseQuery = `?start=${startDate}&end=${endDate}`;
        const path = `/reports/workers/${worker.workerId}/period${baseQuery}`;
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
                <label className="block text-sm font-medium mb-2">Сотрудник</label>
                <Select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    onBlur={() => handleFieldBlur('worker')}
                    className={shouldShowError('worker') ? 'border-red-500' : ''}
                >
                    <option value="">Выберите сотрудника</option>
                    {sortedData.map(worker => (
                        <option key={worker._id} value={worker.workerId}>
                            {worker.name}
                        </option>
                    ))}
                </Select>
                {shouldShowError('worker') && (
                    <p className="mt-1 text-sm text-red-500">{ERROR_MESSAGES.WORKER_REQUIRED}</p>
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