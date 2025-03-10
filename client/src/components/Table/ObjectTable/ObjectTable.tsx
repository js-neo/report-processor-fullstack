// client/src/components/Table/ObjectTable/ObjectTable.tsx
'use client';

import { ReactNode } from 'react';
import ObjectTableDataRow from "@/components/Table/ObjectTable/ObjectTableDataRow";
import ObjectTableHeaderRow from "@/components/Table/ObjectTable/ObjectTableHeaderRow";
import ObjectTableFooterRow from "@/components/Table/ObjectTable/ObjectTableFooterRow";


const ObjectTable = ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full table-fixed border-collapse text-sm">
            {children}
        </table>
    </div>
);

ObjectTable.Head = ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-50">{children}</thead>
);

ObjectTable.Body = ({ children }: { children: ReactNode }) => (
    <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
);

ObjectTable.HeaderRow = ObjectTableHeaderRow;
ObjectTable.DataRow = ObjectTableDataRow;
ObjectTable.FooterRow = ObjectTableFooterRow;

export default ObjectTable;