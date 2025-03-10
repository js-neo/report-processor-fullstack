// client/src/app/reports/objects/[objectName]/page.tsx
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import ObjectTable from '@/components/Table/ObjectTable/ObjectTable';
import { useReports } from '@/hooks/useReports';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { formatReportPeriod, generateDateHeaders } from '@/utils/helpers';
import {ExportToExcelButton} from "@/components/ExportToExcelButton";

export default function ObjectReportPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const objectName = params.objectName as string;
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;

    const { response: objectReport, loading, error } = useReports({
        type: 'object',
        objectName,
        startDate: start,
        endDate: end
    });

    if (loading) return <div className="p-6 text-center"><LoadingSpinner /></div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!objectReport?.data) return <div className="p-6 text-gray-500">Нет данных по объекту</div>;

    const data = objectReport.data;
    const columns = [
        'Номер',
        'Должность',
        'Имя сотрудника',
        'Ставка в час',
        'Общее количество часов',
        'Общая стоимость работ',
        ...generateDateHeaders(start, end),
        'Примечания'
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-4">
            <ExportToExcelButton
                type="object"
                data={data}
                fileName={`отчет_${objectName}_${start}-${end}`}
                startDate={start}
                endDate={end}
                workerName={""}
            />

            <div className="p-4 bg-gray-50">
                <h2 className="text-xl font-semibold">
                    Отчет по объекту: {data.objectName} ({formatReportPeriod(start, end)})
                </h2>
            </div>

            <ObjectTable>
                <ObjectTable.Head>
                    <ObjectTable.HeaderRow columns={columns} />
                </ObjectTable.Head>
                <ObjectTable.Body>
                    {data.employees.map((employee, idx) => (
                        <ObjectTable.DataRow
                            key={employee.id}
                            employee={employee}
                            dates={generateDateHeaders(start, end)}
                            index={idx}
                        />
                    ))}
                    <ObjectTable.FooterRow data={data} start={start} end={end} />
                </ObjectTable.Body>
            </ObjectTable>
        </div>
    );
}