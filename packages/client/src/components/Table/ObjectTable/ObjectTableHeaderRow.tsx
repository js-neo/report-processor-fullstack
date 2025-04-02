// packages/client/src/components/Table/ObjectTable/ObjectTableHeaderRow.tsx
'use client';

import {FC, ReactNode} from "react";

export interface ObjectTableHeaderRowProps {
    columns: string[];
    objectName: string;
    period: string;
    children?: ReactNode;
}

const ObjectTableHeaderRow: FC<ObjectTableHeaderRowProps> = ({ columns, objectName, period}) => {
    const len = columns.length;
    return <>
        <tr>
            <th colSpan={len} className="px-2 py-4 text-left text-lg font-semibold dark:text-gray-300">
                Табель учета рабочего времени
            </th>
        </tr>
        <tr>
            <td colSpan={2} className="px-2 py-2 font-medium dark:text-gray-300">Отчет по объекту:</td>
            <td colSpan={3} className="px-2 py-2 dark:text-gray-300">{objectName}</td>
            <td colSpan={len - 5}></td>
        </tr>
        <tr>
            <td colSpan={2} className="px-2 py-2 font-medium dark:text-gray-300">Отчетный период:</td>
            <td colSpan={3} className="px-2 py-2 dark:text-gray-300">{period}</td>
            <td colSpan={len - 5}></td>
        </tr>
        <tr>
            {columns.map((header, idx) => (
                <th
                    key={idx}
                    className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300
                uppercase tracking-wider border border-gray-300 dark:border-gray-600"
                >
                    {header}
                </th>
            ))}
        </tr>
    </>
}

ObjectTableHeaderRow.displayName = 'ObjectTableHeaderRow';

export default ObjectTableHeaderRow;