// packages/client/src/components/Table/ObjectTable/ObjectTableDataRow.tsx
'use client';

import { IObjectReportEmployee } from 'shared';
import {FC, ReactNode} from "react";

export interface ObjectTableDataRowProps {
    employee: IObjectReportEmployee;
    dates: string[];
    index: number;
    children?: ReactNode;
}

const ObjectTableDataRow: FC<ObjectTableDataRowProps> = ({ employee, dates, index }: ObjectTableDataRowProps) => (
    <tr className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}>
        <td className="px-3 py-2 text-center border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {index + 1}
        </td>
        <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {employee.position}
        </td>
        <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {employee.workerName}
        </td>
        <td className="px-3 py-2 text-right border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {employee.rate} ₽/ч
        </td>
        <td className="px-3 py-2 text-right border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {employee.totalHours}
        </td>
        <td className="px-3 py-2 text-right border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {employee.totalCost} ₽
        </td>

        {dates.map((_, dayIdx) => (
            <td key={dayIdx} className="px-3 py-2 text-center border border-gray-300 dark:border-gray-600 dark:text-gray-300">
                {employee.dailyHours[dayIdx] > 0 ? employee.dailyHours[dayIdx] : '-'}
            </td>
        ))}

        <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300">
            {employee.comment || ''}
        </td>
    </tr>
);

ObjectTableDataRow.displayName = 'ObjectTableDataRow';

export default ObjectTableDataRow;