// client/src/components/Table/ObjectTable/ObjectTableHeaderRow.tsx
'use client';

interface ObjectTableHeaderRowProps {
    columns: string[];
}

const ObjectTableHeaderRow = ({ columns }: ObjectTableHeaderRowProps) => (
    <tr>
        {columns.map((header, idx) => (
            <th
                key={idx}
                className="px-2 py-3 text-center text-xs font-medium text-gray-500
        uppercase tracking-wider border border-gray-300"
            >
                {header}
            </th>
        ))}
    </tr>
);

export default ObjectTableHeaderRow;