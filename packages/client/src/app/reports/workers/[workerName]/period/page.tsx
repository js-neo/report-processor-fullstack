// packages/client/src/app/reports/workers/[workerName]/period/page.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import EmployeeTable from "@/components/Table/EmployeeTable/EmployeeTable";
import EmployeeTableHead from '@/components/Table/EmployeeTable/EmployeeTableHead';
import EmployeeTableBody from '@/components/Table/EmployeeTable/EmployeeTableBody';
import { useReports } from '@/hooks/useReports';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import {ExportToExcelButton} from "@/components/ExportToExcelButton";

export default function UserReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const workerName = decodeURIComponent(params.workerName as string);
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;

    const startUTC = new Date(`${start}T00:00:00+03:00`).toISOString();
    const endUTC = new Date(`${end}T23:59:59+03:00`).toISOString();
    const { response: reports, loading, error } = useReports({
        type: 'employee',
        workerName,
        startDate: startUTC,
        endDate: endUTC
    });

    if (loading) {
        return <div className="p-6 text-center dark:bg-gray-800"><LoadingSpinner /></div>;
    }

    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto dark:bg-gray-800 rounded-lg">
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 font-medium">
                        Ошибка загрузки данных:
                    </div>
                    <pre className="mt-2 p-4 bg-red-100 dark:bg-red-900/10 rounded-md text-red-700 dark:text-red-300 overflow-x-auto">
                        <code className="font-mono text-sm">
                            {error.toString()}
                        </code>
                    </pre>
                </div>
            </div>
        );
    }

    if (!reports || !reports.data || reports.data.length === 0) {
        return (
            <div className="p-6 text-gray-500 dark:text-gray-400 dark:bg-gray-800">
                Нет данных за выбранный период ({start} - {end}).
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto dark:bg-gray-800 rounded-lg space-y-4">
            <ExportToExcelButton
                type="employee"
                data={reports.data}
                fileName={`отчет_${workerName}_${start}-${end}`}
                startDate={start}
                endDate={end}
                name={workerName}
            />
            <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                <EmployeeTable>
                    <EmployeeTableHead
                        reports={reports.data}
                        startDate={start}
                        endDate={end}
                        workerName={workerName}
                    />
                    <EmployeeTableBody reports={reports.data} />
                </EmployeeTable>
            </div>
        </div>
    );
}