// packages/client/src/hooks/useReportForm.ts
"use client";

import { useState } from 'react';
import { IReport } from 'shared';
import { useWorkers } from './useWorkers';

export const useReportForm = (report: IReport) => {
    const [formData, setFormData] = useState({
        task: report.analysis?.task || '',
        workers: report.analysis?.workers || [],
        time: report.analysis?.time || 0
    });

    const { workers } = useWorkers(report.objectRef?.toString());

    const availableWorkers = workers.allWorkers.filter(worker =>
        !formData.workers.some(w => w.workerId === worker._id)
    );

    const addWorker = (workerId: string) => {
        const workerToAdd = workers.allWorkers.find(w => w._id === workerId);
        if (!workerToAdd) return;

        setFormData(prev => ({
            ...prev,
            workers: [...prev.workers, {
                workerId: workerToAdd._id,
                name: workerToAdd.name
            }]
        }));
    };

    const removeWorker = (workerId: string) => {
        setFormData(prev => ({
            ...prev,
            workers: prev.workers.filter(w => w.workerId !== workerId)
        }));
    };

    const updateField = <K extends keyof typeof formData>(
        field: K,
        value: typeof formData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return {
        formData,
        availableWorkers,
        addWorker,
        removeWorker,
        updateField
    };
};