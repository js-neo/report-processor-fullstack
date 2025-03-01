

import { ReportsClient } from '@/components/ReportsClient';

export default function ReportsPage() {
    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">Отчеты анализа</h1>
            <ReportsClient />
        </div>
    );
}