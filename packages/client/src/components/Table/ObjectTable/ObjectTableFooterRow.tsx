// packages/client/src/components/Table/ObjectTable/ObjectTableFooterRow.tsx

'use client';

import { IObjectReport } from 'shared';
import { generateDateHeaders } from '@/utils/helpers';
import {FC, ReactNode} from "react";

export interface ObjectTableFooterRowProps {
    data: IObjectReport;
    start: string;
    end: string;
    children?: ReactNode;
}

const ObjectTableFooterRow: FC<ObjectTableFooterRowProps> = ({ data, start, end }) => {
    const datesCount = generateDateHeaders(start, end).length;

    return (
        <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
            <td colSpan={4} className="px-3 py-2 text-right border border-gray-300 dark:border-gray-600 dark:text-gray-300">
                Итого:
            </td>
            <td className="px-3 py-2 text-right border border-gray-300 dark:border-gray-600 dark:text-gray-300">
                {data.totalHours}
            </td>
            <td className="px-3 py-2 text-right border border-gray-300 dark:border-gray-600 dark:text-gray-300">
                {data.totalCost} ₽
            </td>
            <td
                className="px-3 py-2 border border-gray-300 dark:border-gray-600"
                colSpan={datesCount + 1}
            ></td>
        </tr>
    );
};

ObjectTableFooterRow.displayName = 'ObjectTableFooterRow';

export default ObjectTableFooterRow;