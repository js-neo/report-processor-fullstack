// client/src/app/reports/workers/[workerName]/page.tsx
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

    const workerName = params.workerName as string;
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;

    const { response: reports, loading, error } = useReports({
        type: 'employee',
        workerName,
        startDate: start,
        endDate: end
    });

    console.log("error_2:", error);

    if (loading) {
        return <div className="p-6 text-center"><LoadingSpinner /></div>;
    }

    if (error) {

        return (
            <div className="p-6 bg-red-50 rounded-lg">
                <div className="text-red-600 font-medium">
                    Ошибка загрузки данных:
                </div>
                <pre className="mt-2 p-4 bg-red-100 rounded-md text-red-700 overflow-x-auto">
                    <code className="font-mono text-sm">
                        {error}
                    </code>
                </pre>
            </div>
        );
    }

    if (!reports.data || reports.data.length === 0) {
        return (
            <div className="p-6 text-gray-500">
                Нет данных за выбранный период ({start} - {end}).
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <ExportToExcelButton
                type="employee"
                data={reports.data}
                fileName={`отчет_${workerName}_${start}-${end}`}
                startDate={start}
                endDate={end}
                name={workerName}
            />
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
    );
}