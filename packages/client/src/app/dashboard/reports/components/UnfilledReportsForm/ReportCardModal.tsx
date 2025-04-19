// packages/client/src/app/dashboard/reports/components/UnfilledReportsForm/ReportCardModal.tsx
'use client';

import React, { useState } from 'react';
import { IReport } from 'shared';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { Input } from '@/components/UI/Input';
import { Select } from '@/components/UI/Select';
import { Textarea } from '@/components/UI/Textarea';
import { useWorkers } from '@/hooks/useWorkers';
import { updateReport } from '@/lib/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WorkerOption {
    value: string;
    label: string;
}

interface FormData {
    task?: string | null;
    workers?: Array<{ workerId: string; name: string }> | null;
    time?: number | null;
}

interface ReportCardModalProps {
    report: IReport;
    onCloseAction: () => void;
    onSaveAction: (report: IReport) => void;
}

export const ReportCardModal = ({
                                    report,
                                    onCloseAction,
                                    onSaveAction,
                                }: ReportCardModalProps) => {
    const [formData, setFormData] = useState<FormData>({
        task: report.analysis?.task || '',
        workers: report.analysis?.workers || [],
        time: report.analysis?.time || 0
    });

    const [selectedWorkerId, setSelectedWorkerId] = useState('');
    const [isAddingWorker, setIsAddingWorker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { workers, loading: workersLoading } = useWorkers(report.objectRef?.toString());

    const availableWorkers = workers.allWorkers.filter(worker =>
        !formData.workers?.some(w => w.workerId === worker._id)
    );

    const workerOptions: WorkerOption[] = availableWorkers.map(worker => ({
        value: worker._id,
        label: `${worker.name} (${worker.position})`
    }));

    const handleAddWorker = () => {
        if (!selectedWorkerId) return;

        const workerToAdd = workers.allWorkers.find(w => w._id === selectedWorkerId);
        if (!workerToAdd) return;

        setFormData(prev => ({
            ...prev,
            workers: [...(prev.workers || []), {
                workerId: workerToAdd._id,
                name: workerToAdd.name
            }]
        }));

        setSelectedWorkerId('');
        setIsAddingWorker(false);
    };

    const handleRemoveWorker = (workerId: string) => {
        setFormData(prev => ({
            ...prev,
            workers: prev.workers?.filter(w => w.workerId !== workerId) || []
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updatedReport = await updateReport(report._id, {
                task: formData.task || null,
                workers: formData.workers?.length ? formData.workers : null,
                time: formData.time || null
            });

            onSaveAction(updatedReport);
            onCloseAction();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={true} onCloseAction={onCloseAction} title="Заполнение отчёта">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Сотрудник:</label>
                        <p className="text-sm">{report.user.name}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Дата:</label>
                        <p className="text-sm">
                            {new Date(report.timestamp).toLocaleDateString('ru-RU')}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="task" className="block text-sm font-medium">
                        Задача:
                    </label>
                    <Textarea
                        id="task"
                        value={formData.task || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setFormData({...formData, task: e.target.value})
                        }
                        placeholder="Опишите задачу"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Участники:</label>

                    {formData.workers?.length ? (
                        <div className="space-y-2">
                            {formData.workers.map(worker => (
                                <div key={worker.workerId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span>{worker.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveWorker(worker.workerId)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Рабочие не добавлены</p>
                    )}

                    {!isAddingWorker ? (
                        <Button
                            type="button"
                            onClick={() => setIsAddingWorker(true)}
                            className="mt-2"
                        >
                            Добавить рабочего
                        </Button>
                    ) : (
                        <div className="flex gap-2 mt-2">
                            <Select
                                value={selectedWorkerId}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setSelectedWorkerId(e.target.value)
                                }
                                disabled={workersLoading || workerOptions.length === 0}
                            >
                                <option value="">Выберите рабочего</option>
                                {workerOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                type="button"
                                onClick={handleAddWorker}
                                disabled={!selectedWorkerId}
                            >
                                Добавить
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setIsAddingWorker(false);
                                    setSelectedWorkerId('');
                                }}
                            >
                                Отмена
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="time" className="block text-sm font-medium">
                        Время работы (часы):
                    </label>
                    <Input
                        id="time"
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.time || 0}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({...formData, time: Number(e.target.value)})
                        }
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCloseAction}
                        disabled={isSubmitting}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        Сохранить
                    </Button>
                </div>
            </form>
        </Modal>
    );
};