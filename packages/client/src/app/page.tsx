// packages/client/src/app/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import DynamicDropdown from '@/components/UI/Dropdown/DynamicDropdown';
import { useWorkers, useObjects } from '@/hooks/useReports';

export default function HomePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'employee' | 'object'>('employee');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [workerName, setWorkerName] = useState('');
    const [objectName, setObjectName] = useState('');
    const [formError, setFormError] = useState('');

    const { workers, loading: workersLoading, error: workersError } = useWorkers();
    const { objects, loading: objectsLoading, error: objectsError } = useObjects();
    console.log('workersError: ', workersError);
    console.log('objectsError: ', objectsError);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setFormError('Пожалуйста, заполните обе даты');
            return;
        }
        setFormError('');
        const baseQuery = `?start=${startDate}&end=${endDate}`;
        const path = activeTab === 'employee'
            ? `/reports/workers/${workerName}/period${baseQuery}`
            : `/reports/objects/${objectName}/period${baseQuery}`;

        router.push(path);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl text-center font-bold mb-6 text-gray-800 dark:text-gray-100">
                Генератор отчётов
            </h2>

            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('employee')}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                        activeTab === 'employee'
                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    По сотруднику
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('object')}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                        activeTab === 'object'
                            ? 'bg-blue-600 dark:bg-blue-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    По объекту
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Начальная дата
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-md transition-colors
                                border-gray-300 dark:border-gray-600
                                bg-white dark:bg-gray-700
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                focus:border-blue-500 dark:focus:border-blue-400"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Конечная дата
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-md transition-colors
                                border-gray-300 dark:border-gray-600
                                bg-white dark:bg-gray-700
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                focus:border-blue-500 dark:focus:border-blue-400"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {activeTab === 'employee' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Имя сотрудника
                        </label>
                        <DynamicDropdown
                            type="employee"
                            data={workers}
                            selectedValue={workerName}
                            onChange={setWorkerName}
                            placeholder="Выберите сотрудника"
                            loading={workersLoading}
                            error={workersError || undefined}
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Название объекта
                        </label>
                        <DynamicDropdown
                            type="object"
                            data={objects}
                            selectedValue={objectName}
                            onChange={setObjectName}
                            placeholder="Выберите объект"
                            loading={objectsLoading}
                            error={objectsError || undefined}
                        />
                    </div>
                )}

                {(formError || workersError || objectsError) && (
                    <div className="space-y-1">
                        {formError && <p className="text-red-500 dark:text-red-400 text-sm">{formError}</p>}
                        {workersError && <p className="text-red-500 dark:text-red-400 text-sm">{workersError}</p>}
                        {objectsError && <p className="text-red-500 dark:text-red-400 text-sm">{objectsError}</p>}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md
                        hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={workersLoading || objectsLoading}
                >
                    {activeTab === 'employee'
                        ? 'Сгенерировать по сотруднику'
                        : 'Сгенерировать по объекту'}
                </button>
            </form>
        </div>
    );
}