// packages/client/src/services/workerService.ts

import { workerAPI } from '@/lib/api';
import type { IWorker } from 'shared';

export const workerService = {

    async getWorkers(userObjectId?: string) {
        console.log('getWorkers', userObjectId);
        const { data } = await workerAPI.getAllWorkers();
        return {
            allWorkers: data,
            assignedToThisObject: data.filter((w: IWorker) => w.objectRef?._id === userObjectId),
            assignedToOtherObjects: data.filter((w: IWorker) => w.objectRef?._id && w.objectRef?._id !== userObjectId),
            unassigned: data.filter((w: IWorker) => !w.objectRef?._id),
        };
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