// packages/client/src/app/dashboard/components/EmployeesManagement/WorkerCard.tsx
'use client';

import {Button} from "@/components/UI/Button";
import {IWorker} from "shared";
import {cn} from "@/utils";

type WorkerCardProps = {
    worker: IWorker;
    onUnassignAction: () => void;
    onAssignAction: () => void;
    showUnassign: boolean;
    cardType: 'current-object' | 'other-object' | 'unassigned';
};

export const WorkerCard = ({ worker, onUnassignAction, onAssignAction, showUnassign, cardType }: WorkerCardProps) => {
    const cardClasses = cn(
        "rounded-lg shadow-sm p-4 border",
        {
            'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30': cardType === 'current-object',
            'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/30': cardType === 'other-object',
            'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30': cardType === 'unassigned',
        }
    );

    return (
        <div className={cardClasses}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {worker.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {worker.position || "Без специальности"}
                    </p>
                </div>
                {worker?.objectRef?._id ?
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs">
                    Назначен
                </span> :
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                    Свободен
                </span>
                }
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
                            {worker?.objectRef?.name || 'Не назначен'}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="mt-4 flex justify-end">
                {showUnassign ? (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={onUnassignAction}
                        disabled={!worker?.objectRef?._id}
                    >
                        Удалить
                    </Button>
                ) : (
                    (cardType === 'other-object' || cardType === 'unassigned') && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onAssignAction}
                        >
                            Добавить
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};