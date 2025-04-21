// packages/client/src/app/reports/unfilled/[objectId]/period/page.tsx

import {UnfilledReportsTable} from "@/app/dashboard/reports/components/UnfilledReportsForm/UnfilledReportsTable";

export default function UnfilledReportsPage() {
    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Незаполненные отчеты</h1>
            <UnfilledReportsTable />
        </div>
    );
}