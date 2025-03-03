// client/src/components/Table/ObjectTable/ObjectTable.tsx

'use client';

import { ReactNode } from 'react';

const ObjectTable = ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">{children}</table>
    </div>
);

ObjectTable.Head = ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-50">{children}</thead>
);

ObjectTable.Body = ({ children }: { children: ReactNode }) => (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

export default ObjectTable;