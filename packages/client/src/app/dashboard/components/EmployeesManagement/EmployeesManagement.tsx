// packages/client/src/app/dashboard/components/EmployeesManagement/EmployeesManagement.tsx

'use client';

import { useState } from 'react';
import { useWorkers } from '@/hooks/useReports';
import { WorkerCard } from './WorkerCard';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { useUser } from "@/stores/appStore";
import {BASE_URL} from "@/lib/api";

export const EmployeesManagement = () => {
    const user = useUser();
    const { workers, error, refresh } = useWorkers();
    const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userObjectId = user?.objectRef?._id;

    const assignedToThisObject = workers.filter(worker =>
        worker.objectRef?._id === userObjectId
    );

    const assignedToOtherObjects = workers.filter(worker =>
        worker.objectRef?._id && worker.objectRef._id !== userObjectId
    );

    const unassignedWorkers = workers.filter(worker =>
        !worker.objectRef?._id
    );

    const handleAssign = async (workerId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/workers/${workerId}/object`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ action: 'assign', userObjectId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка сервера');
            }

            refresh();
        } catch (error) {
            console.error('Ошибка:', error instanceof Error ? error.message : 'Неизвестная ошибка');
        }
    };

    const handleUnassign = async (workerId: string) => {
        try {
            const response = await fetch(`/api/workers/${workerId}/object`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ action: 'unassign' }),
            });

            if (!response.ok) throw new Error('Ошибка открепления');

            refresh();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Ошибка:', error instanceof Error ? error.message : 'Неизвестная ошибка');
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

            {assignedToThisObject.length > 0 && (
                <>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Работники на этом объекте
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignedToThisObject.map((worker) => (
                            <WorkerCard
                                key={worker._id}
                                worker={worker}
                                showUnassign={true}
                                cardType="current-object"
                                onUnassignAction={() => {
                                    setSelectedWorker(worker._id);
                                    setIsModalOpen(true);
                                }}
                                onAssignAction={() => {}}
                            />
                        ))}
                    </div>
                </>
            )}

            {(assignedToThisObject.length > 0 && (assignedToOtherObjects.length > 0 || unassignedWorkers.length > 0)) && (
                <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
            )}

            {assignedToOtherObjects.length > 0 && (
                <>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Работники на других объектах
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignedToOtherObjects.map((worker) => (
                            <WorkerCard
                                key={worker._id}
                                worker={worker}
                                showUnassign={false}
                                cardType="other-object"
                                onUnassignAction={() => {}}
                                onAssignAction={() => {}}
                            />
                        ))}
                    </div>
                </>
            )}

            {(assignedToOtherObjects.length > 0 && unassignedWorkers.length > 0) && (
                <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
            )}

            {unassignedWorkers.length > 0 && (
                <>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Свободные работники
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unassignedWorkers.map((worker) => (
                            <WorkerCard
                                key={worker._id}
                                worker={worker}
                                showUnassign={false}
                                cardType="unassigned"
                                onUnassignAction={() => {}}
                                onAssignAction={() => handleAssign(worker._id)}
                            />
                        ))}
                    </div>
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Подтверждение действия"
            >
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Вы уверены, что хотите открепить сотрудника от объекта?
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
                        onClick={() => {
                            if (selectedWorker) handleUnassign(selectedWorker);
                        }}
                    >
                        Подтвердить
                    </Button>
                </div>
            </Modal>
        </div>
    );
};