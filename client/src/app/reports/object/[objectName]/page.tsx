// client/src/app/reports/object/[objectName]/page.tsx

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import ObjectTableHead from '@/components/Table/ObjectTable/ObjectTableHead';
import ObjectTableBody from '@/components/Table/ObjectTable/ObjectTableBody';
import ObjectTable from '@/components/Table/ObjectTable/ObjectTable';
import { useReports } from '@/hooks/useReports';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

export default function ObjectReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const objectName = params.objectName as string;
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;

    const { data: objectReport, loading, error } = useReports({
        type: 'object',
        objectName,
        startDate: start,
        endDate: end
    });

    if (loading) return <div className="p-6 text-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!objectReport) return <div className="p-6 text-gray-500">Нет данных по объекту</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">
                Отчет по объекту: {objectReport.name} ({new Date(start).toLocaleDateString('ru-RU')} - {new Date(end).toLocaleDateString('ru-RU')})
            </h1>
            <ObjectTable>
                <ObjectTableHead
                    data={objectReport}
                    startDate={start}
                    endDate={end}
                />
                <ObjectTable.Body>
                    <ObjectTableBody
                        data={objectReport}
                        startDate={start}
                        endDate={end}
                    />
                </ObjectTable.Body>
            </ObjectTable>
        </div>
    );
}