// client/src/app/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function HomePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'employee' | 'object'>('employee');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [workerName, setWorkerName] = useState('');
    const [objectName, setObjectName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            setError('Пожалуйста, заполните обе даты');
            return;
        }

        const baseQuery = `?start=${startDate}&end=${endDate}`;
        const path = activeTab === 'employee'
            ? `/reports/workers/${encodeURIComponent(workerName)}/period${baseQuery}`
            : `/reports/objects/${encodeURIComponent(objectName)}/period${baseQuery}`;

        router.push(path);
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Генератор табелей</h2>

            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab('employee')}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                        activeTab === 'employee'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    По сотруднику
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('object')}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                        activeTab === 'object'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    По объекту
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Начальная дата
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Конечная дата
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {activeTab === 'employee' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Имя сотрудника
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите workerName сотрудника"
                            value={workerName}
                            onChange={(e) => setWorkerName(e.target.value)}
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название объекта
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите название объекта"
                            value={objectName}
                            onChange={(e) => setObjectName(e.target.value)}
                        />
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {activeTab === 'employee' ? 'Сгенерировать по сотруднику' : 'Сгенерировать по объекту'}
                </button>
            </form>
        </div>
    );
}