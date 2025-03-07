// client/src/components/Table/ObjectTable/ObjectTableBody.tsx
'use client';

import { ObjectReport } from "@shared/types/report"
import { generateDateHeaders } from '@/utils/helpers';

interface ObjectTableBodyProps {
    data: ObjectReport;
    startDate: string;
    endDate: string;
}

const ObjectTableBody = ({ data, startDate, endDate }: ObjectTableBodyProps) => {
    const dates = generateDateHeaders(startDate, endDate);

    return (
        <tbody className="bg-white divide-y divide-gray-200">
        {data.employees.map((employee, idx) => (
            <tr key={employee.id}>
                <td className="px-3 py-2 text-center">{idx + 1}</td>
                <td className="px-3 py-2">{employee.position}</td>
                <td className="px-3 py-2">{employee.workerName}</td>
                <td className="px-3 py-2 text-right">{employee.rate} ₽/ч</td>
                <td className="px-3 py-2 text-right">{employee.totalHours}</td>
                <td className="px-3 py-2 text-right">{employee.totalCost} ₽</td>

                {dates.map((_date, dayIdx) => (
                    <td key={dayIdx} className="px-3 py-2 text-center">
                        {employee.dailyHours[dayIdx] > 0 ? employee.dailyHours[dayIdx] : '-'}
                    </td>
                ))}

                <td className="px-3 py-2">{employee.comment || ''}</td>
            </tr>
        ))}

        <tr className="bg-gray-50 font-semibold">
            <td colSpan={4} className="px-3 py-2 text-right">Итого:</td>
            <td className="px-3 py-2 text-right">{data.totalHours}</td>
            <td className="px-3 py-2 text-right">{data.totalCost} ₽</td>
            <td colSpan={dates.length + 1}></td>
        </tr>
        </tbody>
    );
};

export default ObjectTableBody;