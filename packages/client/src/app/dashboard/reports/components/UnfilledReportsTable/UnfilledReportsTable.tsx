// packages/client/src/app/dashboard/reports/components/UnfilledReportsTable/UnfilledReportsTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { IReport} from 'shared';
import {fetchUnfilledReports} from "@/lib/api";
import {useUser} from "@/stores/appStore";

interface ReportWorker {
    name: string;
    workerId: string;
}

export const UnfilledReportsTable = () => {
    const user = useUser();
    const [reports, setReports] = useState<IReport[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        task: string;
        workers: ReportWorker[];
        time: number;
    }>({
        task: '',
        workers: [],
        time: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!user?.objectRef) return;

            try {
                setLoading(true);
                const data = await fetchUnfilledReports(user.objectRef.toString());
                setReports(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user?.objectRef]);

    const handleEdit = (report: IReport) => {
        setEditingId(report._id);
        setFormData({
            task: report.analysis.task,
            workers: [...report.analysis.workers],
            time: report.analysis.time
        });
    };

    const handleSave = async (reportId: string) => {
        try {
            setLoading(true);

            const response = await fetch(`/api/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    analysis: formData
                })
            });

            if (!response.ok) throw new Error('Ошибка сохранения');

            setReports(reports.map(r =>
                r._id === reportId ? {
                    ...r,
                    analysis: formData
                } : r
            ));
            setEditingId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка сохранения');
        } finally {
            setLoading(false);
        }
    };

    const handleWorkerChange = (index: number, field: keyof ReportWorker, value: string) => {
        const updatedWorkers = [...formData.workers];
        updatedWorkers[index] = {
            ...updatedWorkers[index],
            [field]: value
        };
        setFormData({
            ...formData,
            workers: updatedWorkers
        });
    };

    const handleAddWorker = () => {
        setFormData({
            ...formData,
            workers: [...formData.workers, { name: '', workerId: '' }]
        });
    };

    const handleRemoveWorker = (index: number) => {
        const updatedWorkers = [...formData.workers];
        updatedWorkers.splice(index, 1);
        setFormData({
            ...formData,
            workers: updatedWorkers
        });
    };

    if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (reports.length === 0) return <div className="p-4 text-gray-500">Нет незаполненных отчетов</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left">Дата</th>
                    <th className="px-4 py-2 text-left">Задача</th>
                    <th className="px-4 py-2 text-left">Сотрудники</th>
                    <th className="px-4 py-2 text-left">Время</th>
                    <th className="px-4 py-2 text-left">Действия</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(report => (
                    <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                            {new Date(report.timestamp).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="px-4 py-2">
                            {editingId === report._id ? (
                                <input
                                    className="w-full p-1 border rounded"
                                    value={formData.task}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        task: e.target.value
                                    })}
                                />
                            ) : (
                                report.analysis.task || 'Не указано'
                            )}
                        </td>
                        <td className="px-4 py-2">
                            {editingId === report._id ? (
                                <div className="space-y-2">
                                    {formData.workers.map((worker, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                className="flex-1 p-1 border rounded"
                                                value={worker.name}
                                                onChange={(e) =>
                                                    handleWorkerChange(index, 'name', e.target.value)
                                                }
                                                placeholder="Имя сотрудника"
                                            />
                                            <input
                                                className="flex-1 p-1 border rounded"
                                                value={worker.workerId}
                                                onChange={(e) =>
                                                    handleWorkerChange(index, 'workerId', e.target.value)
                                                }
                                                placeholder="ID сотрудника"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveWorker(index)}
                                                className="text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddWorker}
                                        className="text-sm text-blue-500"
                                    >
                                        + Добавить сотрудника
                                    </button>
                                </div>
                            ) : (
                                report.analysis.workers.length > 0
                                    ? report.analysis.workers.map(w => `${w.name} (${w.workerId})`).join(', ')
                                    : 'Не указано'
                            )}
                        </td>
                        <td className="px-4 py-2">
                            {editingId === report._id ? (
                                <input
                                    type="number"
                                    className="w-full p-1 border rounded"
                                    value={formData.time}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        time: Number(e.target.value)
                                    })}
                                    min="0"
                                />
                            ) : (
                                report.analysis.time || '0'
                            )}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                            {editingId === report._id ? (
                                <>
                                    <Button onClick={() => handleSave(report._id)}>
                                        Сохранить
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setEditingId(null)}
                                    >
                                        Отмена
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="secondary"
                                    onClick={() => handleEdit(report)}
                                >
                                    Редактировать
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};