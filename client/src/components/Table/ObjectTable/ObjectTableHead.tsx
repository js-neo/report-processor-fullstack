// client/src/components/Table/ObjectTable/ObjectTableHead.tsx

'use client';

import { ObjectReport } from "@shared/types/report";
import { generateDateHeaders, formatReportPeriod } from '@/utils/helpers';

interface ObjectTableHeadProps {
    data: ObjectReport;
    startDate: string;
    endDate: string;
}

const ObjectTableHead = ({ data, startDate, endDate }: ObjectTableHeadProps) => {
    const columns = [
        'Номер',
        'Должность',
        'Имя сотрудника',
        'Ставка в час',
        'Общее количество часов',
        'Общая стоимость работ',
        ...generateDateHeaders(startDate, endDate),
        'Примечания'
    ];

    return (
        <>
            <div className="p-4 bg-gray-50">
                <h2 className="text-xl font-semibold">
                    Отчет по объекту: {data.name} ({formatReportPeriod(startDate, endDate)})
                </h2>
            </div>

            <thead className="bg-gray-50">
            <tr>
                {columns.map((header, idx) => (
                    <th
                        key={idx}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                        {header}
                    </th>
                ))}
            </tr>
            </thead>
        </>
    );
};

export default ObjectTableHead;