// client/src/components/Table/EmployeeTable/EmployeeTable.tsx

'use client';

import { ReactNode } from 'react';

const EmployeeTable = ({ children }: { children: ReactNode }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">{children}</table>
    </div>
);

EmployeeTable.Head = ({ children }: { children: ReactNode }) => (
    <thead className="bg-gray-50">{children}</thead>
);

EmployeeTable.Body = ({ children }: { children: ReactNode }) => (
    <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
);

export default EmployeeTable;