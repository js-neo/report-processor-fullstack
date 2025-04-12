// packages/client/src/app/dashboard/components/EmployeesManagement/EmployeesManagement.tsx
'use client';

import { useState } from 'react';
import { useWorkers } from '@/hooks/useReports';
import { WorkerCard } from './WorkerCard';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import {IObject, IWorker} from "shared";
import {useUser} from "@/stores/appStore";

export const EmployeesManagement = () => {
    const user  = useUser();
    const { workers, loading, error } = useWorkers();
    const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(true);

    console.log("loading", loading);
    console.log("user_Employees: ", user);

    console.log("user?.objectRef:", user?.objectRef)

    const currentWorkers = workers.filter(
        (worker) => {
            console.log("worker?.objectRef?.objectId:", worker?.objectRef)
            return worker?.objectRef?.objectId === undefined // user?.objectRef?.objectId
        }
    );

    const handleAssign = async (workerId: string) => {
        try {
            console.log("handleAssign: ", workerId);
            const response = await fetch(`/api/workers/${workerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ objectName: user?.objectRef }),
            });

            if (!response.ok) throw new Error('Assignment failed');
            setSelectedWorker(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error assigning worker:', error);
        }
    };

    const onWorkerUpdate = async (workerId: string, newObjectRef?: IObject) => {
        try {
            const response = await fetch(`/api/workers/${workerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    objectRef: newObjectRef || null
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            const updatedWorkers = ( workers: IWorker[], workerId: string) => workers.map(worker =>
                worker.workerId === workerId
                    ? {...worker, objectRef: newObjectRef}
                    : worker
            );

        } catch (error) {
            console.error('Error updating worker:', error);
        }
    };

    const handleUnassign = (worker: IWorker) => {
        if (worker.objectRef && worker.objectRef.name !== user?.objectRef?.name) {
            if (!confirm(`Сотрудник работает на ${worker.objectRef.name}. Сменить объект?`)) {
                return;
            }
        }
        if (user?.objectRef) {
            onWorkerUpdate(worker.workerId, user?.objectRef);
        }

    };


    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Управление сотрудниками
                </h2>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentWorkers.map((worker) => (
                    <WorkerCard
                        key={worker._id}
                        worker={worker}
                        onUnassignAction={() => {
                            setSelectedWorker(worker._id);
                            setIsModalOpen(true);
                        }}
                    />
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Подтверждение действия"
            >
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Вы уверены, что хотите открепить этого сотрудника от объекта?
                </p>
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => selectedWorker && handleAssign(selectedWorker)}
                    >
                        Подтвердить
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
