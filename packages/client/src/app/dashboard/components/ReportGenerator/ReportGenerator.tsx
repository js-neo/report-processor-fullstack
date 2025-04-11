// packages/client/src/app/dashboard/components/ReportGenerator/ReportGenerator.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/UI/Button';
import { DatePicker } from '@/components/UI/DatePicker';

export const ReportGenerator = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerateReport = (type: 'objects' | 'workers') => {
        if (!user?.objectRef) return;

        const basePath = `/reports/${type}/${encodeURIComponent(
            user.objectRef.name
        )}/period`;
        const query = `?start=${startDate}&end=${endDate}`;
        router.push(basePath + query);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Генерация отчетов
                </h2>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                        label="Начальная дата"
                        selected={startDate}
                        onChange={setStartDate}
                    />
                    <DatePicker
                        label="Конечная дата"
                        selected={endDate}
                        onChange={setEndDate}
                    />
                </div>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                    <Button
                        variant="primary"
                        onClick={() => handleGenerateReport('objects')}
                        disabled={!startDate || !endDate}
                    >
                        Отчет по объекту
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleGenerateReport('workers')}
                        disabled={!startDate || !endDate}
                    >
                        Отчет по сотрудникам
                    </Button>
                </div>
            </div>
        </div>
    );
};
