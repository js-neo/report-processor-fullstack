// client/src/components/Table/ObjectTable/ObjectTable.tsx
'use client';

import {FC, ReactNode} from 'react';
import ObjectTableDataRow, {ObjectTableDataRowProps} from "@/components/Table/ObjectTable/ObjectTableDataRow";
import ObjectTableHeaderRow, {ObjectTableHeaderRowProps} from "@/components/Table/ObjectTable/ObjectTableHeaderRow";
import ObjectTableFooterRow, {ObjectTableFooterRowProps} from "@/components/Table/ObjectTable/ObjectTableFooterRow";

interface ObjectTableComponent extends FC<{children: ReactNode}>{
    Head: FC<{children: ReactNode}>;
    Body: FC<{children: ReactNode}>;
    HeaderRow: FC<ObjectTableHeaderRowProps>;
    DataRow: FC<ObjectTableDataRowProps>;
    FooterRow: FC<ObjectTableFooterRowProps>;
}


const ObjectTable: ObjectTableComponent = ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full table-fixed border-collapse text-sm">
            {children}
        </table>
    </div>
);

const Head: FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-50">{children}</thead>
);
Head.displayName = "ObjectTable.Head";

const Body: FC<{children: ReactNode}> = ({ children }: { children: ReactNode }) => (
    <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
);

Body.displayName = "ObjectTable.Body";

ObjectTable.Head = Head;
ObjectTable.Body = Body;

ObjectTable.HeaderRow = ObjectTableHeaderRow;
ObjectTable.DataRow = ObjectTableDataRow;
ObjectTable.FooterRow = ObjectTableFooterRow;

export default ObjectTable;