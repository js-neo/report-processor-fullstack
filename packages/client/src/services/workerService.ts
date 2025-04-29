// packages/client/src/services/workerService.ts
import { workerAPI } from '@/lib/api';
import type { IWorker } from 'shared';

export const workerService = {
    async getWorkers(userObjectId?: string) {
        const { data } = await workerAPI.getAllWorkers();
        return {
            allWorkers: data,
            assignedToThisObject: data.filter((w: IWorker) => w.objectRef?._id === userObjectId),
            assignedToOtherObjects: data.filter((w: IWorker) => w.objectRef?._id && w.objectRef?._id !== userObjectId),
            unassigned: data.filter((w: IWorker) => !w.objectRef?._id),
        };
    },

    async createWorker(workerData: {
        name: string;
        position: string;
        salary_rate: number;
        objectRef?: string | null;
        telegram_username: string;
    }) {
        const response = await workerAPI.createWorker({
            ...workerData,
            telegram_username: workerData.telegram_username.replace(/^@/, '')
        });
        return response;
    },

    async assign(workerId: string, userObjectId: string) {
        return workerAPI.updateAssignment(workerId, {
            action: 'assign',
            userObjectId,
        });
    },

    async unassign(workerId: string) {
        return workerAPI.updateAssignment(workerId, {
            action: 'unassign'
        });
    },
};