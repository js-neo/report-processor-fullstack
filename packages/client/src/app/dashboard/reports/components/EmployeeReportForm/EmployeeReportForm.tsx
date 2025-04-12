// packages/client/src/app/dashboard/reports/components/EmployeeReportForm/EmployeeReportForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useWorkers } from '@/hooks/useReports';
import { Button } from '@/components/UI/Button';
import { DatePicker } from '@/components/UI/DatePicker';
import { Select } from '@/components/UI/Select';
import {useState} from "react";
import {useUser} from "@/stores/appStore";

export const EmployeeReportForm = () => {
    const user = useUser();
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedWorker, setSelectedWorker] = useState('');
    const { workers } = useWorkers();

    const filteredWorkers = workers.filter(
        worker => worker.objectRef?.toString() === user?.objectRef?.toString()
    );

    const handleGenerate = () => {
        const worker = filteredWorkers.find(w => w.name === selectedWorker);
        if (!worker || !startDate || !endDate) return;

        router.push(`/dashboard/reports/workers/${worker.workerId}/period?start=${startDate}&end=${endDate}`);
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
                <label className="block text-sm font-medium mb-2">Сотрудник</label>
                <Select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                >
                    <option value="">Выберите сотрудника</option>
                    {filteredWorkers.map(worker => (
                        <option key={worker.workerId} value={worker.workerId}>
                            {worker.name}
                        </option>
                    ))}
                </Select>
            </div>

            <Button
                onClick={handleGenerate}
                disabled={!selectedWorker || !startDate || !endDate}
            >
                Сгенерировать отчет
            </Button>
        </div>
    );
};