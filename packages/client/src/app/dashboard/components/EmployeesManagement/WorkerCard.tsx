// packages/client/src/app/dashboard/components/EmployeesManagement/WorkerCard.tsx
'use client';

import {Button} from "@/components/UI/Button";

type Worker = {
    _id: string;
    name: string;
    position: string;
    salary_rate: number;
    objectName?: string;
};

type WorkerCardProps = {
    worker: Worker;
    onUnassignAction: () => void;
};

export const WorkerCard = ({ worker, onUnassignAction }: WorkerCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {worker.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {worker.position}
                    </p>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                    {worker.objectName ? 'Назначен' : 'Свободен'}
                </span>
            </div>

            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                <dl className="grid grid-cols-2 gap-3">
                    <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Ставка</dt>
                        <dd className="text-gray-900 dark:text-gray-100">
                            {worker.salary_rate} ₽/час
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-500 dark:text-gray-400">Объект</dt>
                        <dd className="text-gray-900 dark:text-gray-100 truncate">
                            {worker.objectName || 'Не назначен'}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="mt-4 flex justify-end">
                <Button
                    variant="danger"
                    size="sm"
                    onClick={onUnassignAction}
                    disabled={!worker.objectName}
                >
                    Удалить
                </Button>
            </div>
        </div>
    );
};