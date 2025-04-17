// packages/client/src/app/reports/objects/[objectId]/period/page.tsx
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
    const objectName = decodeURIComponent(params.objectName as string);
    const start = searchParams.get('start')!;
    const end = searchParams.get('end')!;
    const startUTC = new Date(`${start}T00:00:00+03:00`).toISOString();
    const endUTC = new Date(`${end}T23:59:59+03:00`).toISOString();

    const { response: objectReport, loading, error } = useReports({
        type: 'object',
        objectName,
        startDate: startUTC,
        endDate: endUTC
    });

    if (loading) return <div className="p-6 text-center dark:bg-gray-800"><LoadingSpinner /></div>;
    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto dark:bg-gray-800 rounded-lg">
                <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 font-medium">
                        Ошибка загрузки данных:
                    </div>
                    <pre className="mt-2 p-4 bg-red-100 dark:bg-red-900/10 rounded-md text-red-700 dark:text-red-300 overflow-x-auto">
                        <code className="font-mono text-sm">
                            {error}
                        </code>
                    </pre>
                </div>
            </div>
        );
    }
    if (!objectReport?.data) return <div className="p-6 text-gray-500 dark:text-gray-400 dark:bg-gray-800">Нет данных по объекту</div>;

    const data = objectReport.data;
    const period = formatReportPeriod(start, end);
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
        <div className="p-6 max-w-7xl mx-auto dark:bg-gray-800 space-y-4">
            <ExportToExcelButton
                type="object"
                data={data}
                fileName={`отчет_${objectName}_${start}-${end}`}
                startDate={start}
                endDate={end}
                name={objectName}
            />

            <ObjectTable>
                <ObjectTable.Head>
                    <ObjectTable.HeaderRow columns={columns} objectName={data.objectName} period={period} />
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