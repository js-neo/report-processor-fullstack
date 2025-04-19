// packages/client/src/app/dashboard/reports/components/UnfilledReportsForm/UnfilledReportsForm.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { DatePicker } from '@/components/UI/DatePicker';
import React, {useEffect, useState} from 'react';
import {useAuthError, useUser} from '@/stores/appStore';
import { Select } from '@/components/UI/Select';
import toast from "react-hot-toast";
import {cn} from "@/utils";

export const UnfilledReportsForm = ({ gridLayout = false }: { gridLayout?: boolean }) => {
    const user = useUser();
    const error = useAuthError();
    const router = useRouter();
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'task' | 'workers' | 'time'>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [limit, setLimit] = useState(10);

    const ERROR_MESSAGES = {
        DATES_INVALID: 'Конечная дата должна быть позже начальной',
        OBJECT_REQUIRED: 'Объект не выбран',
        OBJECT_NOT_FOUND: 'Выбранный объект не найден',
        LOAD_ERROR: 'Ошибка загрузки данных:'
    };

    const objectId = user?.objectRef?.objectId;
    const hasInvalidDates = (startDate && endDate) ? new Date(endDate) < new Date(startDate) : false;
    const isFormValid = !objectId || !hasInvalidDates

    useEffect(() => {
        if (error) {
            toast.error(`${ERROR_MESSAGES.LOAD_ERROR} ${error}`, { duration: 3000 });
        }
    }, [error]);

    const handleGenerate = () => {
        if (!objectId) {
            toast.error(ERROR_MESSAGES.OBJECT_REQUIRED, { duration: 3000 });
            return;
        }

        if (hasInvalidDates) {
            toast.error(ERROR_MESSAGES.DATES_INVALID, { duration: 3000 });
            return;
        }

        const params = new URLSearchParams();
        if (startDate) params.append('start', startDate);
        if (endDate) params.append('end', endDate);
        params.append('status', statusFilter);
        params.append('sort', sortOrder);
        params.append('limit', limit.toString());

        router.push(`/reports/unfilled/${encodeURIComponent(objectId)}/period?${params.toString()}`);
    };

    return (
        <div className={`space-y-6 ${gridLayout ? 'grid grid-cols-1 gap-6' : ''}`}>
            <div className={`${gridLayout ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                <DatePicker
                    label="Начальная дата"
                    selected={startDate}
                    onChangeAction={setStartDate}
                />
                <DatePicker
                    label="Конечная дата"
                    selected={endDate}
                    onChangeAction={setEndDate}
                />
            </div>

            <div className={gridLayout ? 'grid grid-cols-1 gap-4' : 'space-y-4'}>
                <div>
                    <label className="block text-sm font-medium mb-2">Фильтр по статусу</label>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'task' | 'workers' | 'time')}
                    >
                        <option value="all">Все незаполненные</option>
                        <option value="task">Без задачи</option>
                        <option value="workers">Без рабочих</option>
                        <option value="time">Без времени</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Сортировка</label>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                        <option value="desc">Новые сначала</option>
                        <option value="asc">Старые сначала</option>
                    </Select>
                </div>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Показывать по:</span>
                    <Select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-20"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </Select>
                </div>

                <Button
                    variant="primary"
                    onClick={handleGenerate}
                    className={cn(
                        "w-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none",
                        !isFormValid && "opacity-80 cursor-not-allowed hover:opacity-80"
                    )}
                    aria-disabled={!isFormValid}
                >
                    Показать отчеты
                </Button>
            </div>
        </div>
    );
};