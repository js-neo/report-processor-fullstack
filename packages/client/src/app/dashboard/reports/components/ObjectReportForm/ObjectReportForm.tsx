// packages/client/src/app/dashboard/reports/components/ObjectReportForm/ObjectReportForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { DatePicker } from '@/components/UI/DatePicker';
import {useState} from "react";
import {useUser} from "@/stores/appStore";

export const ObjectReportForm = () => {
    const user = useUser();
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerate = () => {
        if (!user?.objectRef || !startDate || !endDate) return;

        const objectName = typeof user.objectRef === 'object'
            ? user.objectRef.name
            : 'Unknown Object';

        router.push(`/dashboard/reports/objects/${encodeURIComponent(objectName)}/period?start=${startDate}&end=${endDate}`);
    };

    return (
        <div className="max-w-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                    label="Начальная дата"
                    selected={startDate}
                    onChange={setStartDate}
                />
                <DatePicker
                    label="Конечная дата"
                    selected={endDate}
                    onChange={setEndDate}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Объект</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={user?.objectRef && typeof user?.objectRef === 'object' ? user.objectRef.name : ''}
                    readOnly
                />
            </div>

            <Button
                onClick={handleGenerate}
                disabled={!startDate || !endDate}
            >
                Сгенерировать отчет
            </Button>
        </div>
    );
};