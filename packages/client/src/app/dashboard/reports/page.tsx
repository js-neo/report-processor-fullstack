// packages/client/src/app/dashboard/reports/page.tsx
'use client';

import { useState } from 'react';
import { useUser } from "@/stores/appStore";
import { Button } from '@/components/UI/Button';
import { EmployeeReportForm } from "@/app/dashboard/reports/components/EmployeeReportForm/EmployeeReportForm";
import { ObjectReportForm } from "@/app/dashboard/reports/components/ObjectReportForm/ObjectReportForm";
import {UnfilledReportsForm} from "@/app/dashboard/reports/components/UnfilledReportsForm/UnfilledReportsForm";

export default function ReportsPage() {
    const user = useUser();
    const [activeReportType, setActiveReportType] = useState<'employee' | 'object' | 'unfilled'>('employee');

    if (!user?.objectRef) return null;

    return (
        <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-160px)] p-6">
            <div className="w-full md:w-64 lg:w-80 space-y-2">
                <h2 className="text-xl font-semibold mb-4 hidden md:block">Типы отчётов</h2>
                <Button
                    variant={activeReportType === 'employee' ? 'primary' : 'secondary'}
                    onClick={() => setActiveReportType('employee')}
                    className="w-full justify-start text-left px-4 py-3 h-auto"
                >
                    <span className="block font-medium">📊 По сотруднику</span>
                    <span className="block text-sm opacity-75 mt-1">Анализ работы сотрудника</span>
                </Button>

                <Button
                    variant={activeReportType === 'object' ? 'primary' : 'secondary'}
                    onClick={() => setActiveReportType('object')}
                    className="w-full justify-start text-left px-4 py-3 h-auto"
                >
                    <span className="block font-medium">🏗️ По объекту</span>
                    <span className="block text-sm opacity-75 mt-1">Общая статистика по объекту</span>
                </Button>

                <Button
                    variant={activeReportType === 'unfilled' ? 'primary' : 'secondary'}
                    onClick={() => setActiveReportType('unfilled')}
                    className="w-full justify-start text-left px-4 py-3 h-auto"
                >
                    <span className="block font-medium">⚠️ Незаполненные</span>
                    <span className="block text-sm opacity-75 mt-1">Список пропущенных отчётов</span>
                </Button>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                        <h3 className="text-2xl font-semibold">
                            {activeReportType === 'employee' && 'Отчёт по сотруднику'}
                            {activeReportType === 'object' && 'Отчёт по объекту'}
                            {activeReportType === 'unfilled' && 'Незаполненные отчёты'}
                        </h3>
                    </div>

                    <div className="space-y-8">
                        {activeReportType === 'employee' && <EmployeeReportForm gridLayout />}
                        {activeReportType === 'object' && <ObjectReportForm gridLayout />}
                        {activeReportType === 'unfilled' && <UnfilledReportsForm gridLayout />}
                    </div>
                </div>
            </div>
        </div>
    );
}
