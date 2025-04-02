// packages/client/src/components/Table/EmployeeTable/EmployeeTable.tsx

'use client';
import { ReactNode, FC } from 'react';

interface EmployeeTableComponent extends FC<{ children: ReactNode }> {
    Head: FC<{ children: ReactNode }>;
    Body: FC<{ children: ReactNode }>;
}

const EmployeeTable: EmployeeTableComponent = ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full table-fixed border-collapse text-sm dark:bg-gray-800">{children}</table>
    </div>
);

const Head: FC<{ children: ReactNode }> = ({ children }) => (
    <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>
);
Head.displayName = 'EmployeeTable.Head';

const Body: FC<{ children: ReactNode }> = ({ children }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">{children}</tbody>
);
Body.displayName = 'EmployeeTable.Body';

EmployeeTable.Head = Head;
EmployeeTable.Body = Body;

export default EmployeeTable;