// client/src/app/reports/user/[username]/page.tsx
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

    const username = params.username as string;
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;

    const { data: reports, loading, error } = useReports({
        type: 'employee',
        username,
        startDate: start,
        endDate: end
    });

    if (loading) {
        return <div className="p-6 text-center"><LoadingSpinner /></div>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                Ошибка загрузки данных: {error}
            </div>
        );
    }

    if (!reports || reports.length === 0) {
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
                data={reports}
                fileName={`отчет_${username}_${start}-${end}`}
                startDate={start}
                endDate={end}
            />
            <EmployeeTable>
                <EmployeeTableHead
                    reports={reports}
                    startDate={start}
                    endDate={end}
                    username={username}
                />
                <EmployeeTableBody reports={reports} />
            </EmployeeTable>
        </div>
    );
}