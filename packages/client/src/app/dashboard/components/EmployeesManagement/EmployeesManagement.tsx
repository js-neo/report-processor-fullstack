'use client';

import { useWorkers } from '@/hooks/useWorkers';
import { WorkerCard } from './WorkerCard';
import { Button } from '@/components/UI/Button';
import { Modal } from '@/components/UI/Modal';
import { useUser } from "@/stores/appStore";
import {useState} from "react";
import LoadingSpinner from "@/components/Common/LoadingSpinner";

export const EmployeesManagement = () => {
    const user = useUser();
    const userObjectId = user?.objectRef?._id;
    const {
        workers: { assignedToOtherObjects, assignedToThisObject, unassigned },
        error,
        assignWorker,
        unassignWorker
    } = useWorkers(userObjectId);

    const [selectedWorker, setSelectedWorker] = useState<{
        id: string;
        name?: string;
        objectName?: string;
        action: 'assign' | 'unassign';
    } | null>(null);

    const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAssign = async () => {
        if (selectedWorker && userObjectId) {
            setIsProcessing(true);
            try {
                await assignWorker(selectedWorker.id, userObjectId);
                setIsAssignModalOpen(false);
            } catch (err) {
                console.error('Failed to assign worker:', err);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleUnassign = async () => {
        if (selectedWorker) {
            setIsProcessing(true);
            try {
                await unassignWorker(selectedWorker.id);
                setIsUnassignModalOpen(false);
            } catch (err) {
                console.error('Failed to unassign worker:', err);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;

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
                                    setSelectedWorker({
                                        id: worker._id,
                                        name: worker.name,
                                        objectName: worker.objectRef?.name,
                                        action: 'unassign'
                                    });
                                    setIsUnassignModalOpen(true);
                                }}
                                onAssignAction={() => {}}
                            />
                        ))}
                    </div>
                </>
            )}

            {(assignedToThisObject.length > 0 && (assignedToOtherObjects.length > 0 || unassigned.length > 0)) && (
                <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
            )}

            {(assignedToOtherObjects.length > 0 && userObjectId) && (
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
                                onAssignAction={() => {
                                    setSelectedWorker({
                                        id: worker._id,
                                        name: worker.name,
                                        objectName: worker.objectRef?.name,
                                        action: 'assign'
                                    });
                                    setIsAssignModalOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            {(assignedToOtherObjects.length > 0 && unassigned.length > 0) && (
                <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
            )}

            {(unassigned.length > 0 && userObjectId) && (
                <>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Свободные работники
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unassigned.map((worker) => (
                            <WorkerCard
                                key={worker._id}
                                worker={worker}
                                showUnassign={false}
                                cardType="unassigned"
                                onUnassignAction={() => {}}
                                onAssignAction={() => {
                                    setSelectedWorker({
                                        id: worker._id,
                                        name: worker.name,
                                        action: 'assign'
                                    });
                                    setIsAssignModalOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            <Modal
                isOpen={isUnassignModalOpen}
                onClose={() => !isProcessing && setIsUnassignModalOpen(false)}
                title="Подтверждение открепления"
            >
                <div className="relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                            <LoadingSpinner />
                        </div>
                    )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Вы уверены, что хотите открепить сотрудника {selectedWorker?.name} от объекта?
                </p>
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsUnassignModalOpen(false)}
                        disabled={isProcessing}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleUnassign}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                    <LoadingSpinner small />
                                    Обработка...
                                </span>
                        ) : (
                            "Подтвердить"
                        )}
                    </Button>
                </div>
                </div>
            </Modal>

            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Подтверждение добавления"
            >
                <div className="relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                            <LoadingSpinner />
                        </div>
                    )}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {selectedWorker?.objectName
                        ? `Вы действительно хотите добавить работника ${selectedWorker.name}, который работает на объекте "${selectedWorker.objectName}"?`
                        : `Вы действительно хотите добавить работника ${selectedWorker?.name}?`}
                </p>
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={() => setIsAssignModalOpen(false)}
                        disabled={isProcessing}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAssign}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                    <LoadingSpinner small />
                                    Обработка...
                                </span>
                        ) : (
                            "Подтвердить"
                        )}
                    </Button>
                </div>
                </div>
            </Modal>
        </div>
    );
};