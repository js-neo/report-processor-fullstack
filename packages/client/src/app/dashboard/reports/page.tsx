// packages/client/src/app/dashboard/reports/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/UI/Button';
import {EmployeeReportForm} from "@/app/dashboard/reports/components/EmployeeReportForm/EmployeeReportForm";
import {ObjectReportForm} from "@/app/dashboard/reports/components/ObjectReportForm/ObjectReportForm";
import {UnfilledReportsTable} from "@/app/dashboard/reports/components/UnfilledReportsTable/UnfilledReportsTable";
import {useUser} from "@/stores/appStore";

export default function ReportsPage() {
    const user = useUser();
    const [activeReportType, setActiveReportType] = useState<'employee' | 'object' | 'unfilled'>('employee');

    if (!user?.objectRef) return null;

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold">Управление отчётами</h2>
                <div className="flex gap-2 mt-4">
                    <Button
                        variant={activeReportType === 'employee' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReportType('employee')}
                    >
                        Отчёт по сотруднику
                    </Button>
                    <Button
                        variant={activeReportType === 'object' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReportType('object')}
                    >
                        Отчёт по объекту
                    </Button>
                    <Button
                        variant={activeReportType === 'unfilled' ? 'primary' : 'secondary'}
                        onClick={() => setActiveReportType('unfilled')}
                    >
                        Незаполненные отчёты
                    </Button>
                </div>
            </div>

            {activeReportType === 'employee' && <EmployeeReportForm />}
            {activeReportType === 'object' && <ObjectReportForm />}
            {activeReportType === 'unfilled' && <UnfilledReportsTable />}
        </div>
    );
}
