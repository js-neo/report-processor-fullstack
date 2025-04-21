// packages/client/src/app/reports/workers/[workerId]/period/page.tsx
'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import EmployeeTable from "@/components/Table/EmployeeTable/EmployeeTable";
import EmployeeTableHead from '@/components/Table/EmployeeTable/EmployeeTableHead';
import EmployeeTableBody from '@/components/Table/EmployeeTable/EmployeeTableBody';
import { useReports } from '@/hooks/useReports';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import {ExportToExcelButton} from "@/components/ExportToExcelButton";
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function UserReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showEmptyMessage, setShowEmptyMessage] = useState(true);

    const workerId = decodeURIComponent(params.workerId as string);
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;

    const startUTC = new Date(`${start}T00:00:00+03:00`).toISOString();
    const endUTC = new Date(`${end}T23:59:59+03:00`).toISOString();
    const { response: reportsWorkerData, loading, error } = useReports({
        type: 'employee',
        workerId,
        startDate: startUTC,
        endDate: endUTC
    });

    const { data: workerData } = reportsWorkerData || {};
    const { workerName, reports } = workerData || {};

    useEffect(() => {
        if (error) {
            toast.error(`Ошибка загрузки отчёта: ${error}`, {duration: 3000});
            const timer = setTimeout(() => router.back(), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, router]);

    useEffect(() => {
        if (!reports || reports.length === 0) {
            const timer = setTimeout(() => {
                setShowEmptyMessage(false);
                router.back()
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [loading, reports, router]);

    if (loading) {
        return <div className="p-6 text-center dark:bg-gray-800"><LoadingSpinner /></div>;
    }

    if (error) {
        return null;
    }

    if (!reports || reports.length === 0) {
        if (!showEmptyMessage) return null;
        return (
            <div className="p-6 font-mono text-gray-500 dark:text-gray-400 dark:bg-gray-800">
                Нет данных за выбранный период ({start} - {end}).
                Автоматический возврат через 3 секунды...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto dark:bg-gray-800 rounded-lg space-y-4">
            <ExportToExcelButton
                type="employee"
                data={reports}
                fileName={`отчет_${workerName}_${start}-${end}`}
                startDate={start}
                endDate={end}
                name={workerName || ""}
            />
            <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                <EmployeeTable>
                    <EmployeeTableHead
                        reports={reports}
                        startDate={start}
                        endDate={end}
                        workerName={workerName || ""}
                    />
                    <EmployeeTableBody reports={reports} />
                </EmployeeTable>
            </div>
        </div>
    );
}