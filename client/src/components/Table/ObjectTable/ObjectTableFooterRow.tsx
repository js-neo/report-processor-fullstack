// client/src/components/Table/ObjectTable/ObjectTableFooterRow.tsx
'use client';

import { IObjectReport } from '@shared/types/report';
import { generateDateHeaders } from '@/utils/helpers';

interface ObjectTableFooterRowProps {
    data: IObjectReport;
    start: string;
    end: string;
}

const ObjectTableFooterRow = ({ data, start, end }: ObjectTableFooterRowProps) => {
    const datesCount = generateDateHeaders(start, end).length;

    return (
        <tr className="bg-gray-50 font-semibold">
            <td colSpan={4} className="px-3 py-2 text-right border border-gray-300">
                Итого:
            </td>
            <td className="px-3 py-2 text-right border border-gray-300">
                {data.totalHours}
            </td>
            <td className="px-3 py-2 text-right border border-gray-300">
                {data.totalCost} ₽
            </td>
            <td
                className="px-3 py-2 border border-gray-300"
                colSpan={datesCount + 1}
            ></td>
        </tr>
    );
};

export default ObjectTableFooterRow;