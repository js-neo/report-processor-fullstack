// packages/server/src/services/workerService.ts
import { Types } from 'mongoose';
import Worker from '../models/Worker.js';
import { ForbiddenError, NotFoundError } from '../errors/errorClasses.js';
import { IObject } from 'shared';

type PopulatedWorker = Omit<InstanceType<typeof Worker>, 'objectRef'> & {
    objectRef: IObject | null;
};

export class WorkerService {
    async updateWorkerObject(
        workerId: string,
        userObjectId: Types.ObjectId,
        action: 'assign' | 'unassign'
    ): Promise<PopulatedWorker> {
        const worker = await Worker.findById(workerId);
        console.log("workerId_service: ", workerId);

        if (!worker) {
            throw new NotFoundError('Worker not found');
        }

        if (!userObjectId) {
            throw new ForbiddenError('User has no object assigned');
        }

        const currentObjectId = worker.objectRef as unknown as Types.ObjectId;

        let update: { objectRef: Types.ObjectId | null };
        if (action === 'assign') {

            if (currentObjectId && currentObjectId.equals(userObjectId)) {
                return this.populateWorker(worker);
            }
            update = { objectRef: userObjectId };
        } else {

            if (!currentObjectId || !currentObjectId.equals(userObjectId)) {
                throw new ForbiddenError('Worker not assigned to your object');
            }
            update = { objectRef: null };
        }

        const updatedWorker = await Worker.findByIdAndUpdate(
            workerId,
            update,
            { new: true, runValidators: true }
        ).populate('objectRef');

        if (!updatedWorker) {
            throw new Error('Worker update failed');
        }

        return this.populateWorker(updatedWorker);
    }

    private async populateWorker(worker: InstanceType<typeof Worker>): Promise<PopulatedWorker> {
        return worker.populate<{ objectRef: IObject | null }>('objectRef');
    }
}