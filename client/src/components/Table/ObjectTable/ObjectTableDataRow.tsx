// client/src/components/Table/ObjectTable/ObjectTableDataRow.tsx
'use client';

import { IObjectReportEmployee } from '@shared/types/report';

interface ObjectTableDataRowProps {
    employee: IObjectReportEmployee;
    dates: string[];
    index: number;
}

const ObjectTableDataRow = ({ employee, dates, index }: ObjectTableDataRowProps) => (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
        <td className="px-3 py-2 text-center border border-gray-300">{index + 1}</td>
        <td className="px-3 py-2 border border-gray-300">{employee.position}</td>
        <td className="px-3 py-2 border border-gray-300">{employee.workerName}</td>
        <td className="px-3 py-2 text-right border border-gray-300">
            {employee.rate} ₽/ч
        </td>
        <td className="px-3 py-2 text-right border border-gray-300">
            {employee.totalHours}
        </td>
        <td className="px-3 py-2 text-right border border-gray-300">
            {employee.totalCost} ₽
        </td>

        {dates.map((_, dayIdx) => (
            <td key={dayIdx} className="px-3 py-2 text-center border border-gray-300">
                {employee.dailyHours[dayIdx] > 0 ? employee.dailyHours[dayIdx] : '-'}
            </td>
        ))}

        <td className="px-3 py-2 border border-gray-300">{employee.comment || ''}</td>
    </tr>
);

export default ObjectTableDataRow;