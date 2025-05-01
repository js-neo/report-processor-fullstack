// packages/server/src/services/workerService.ts
import mongoose, {Types} from 'mongoose';
import Worker from '../models/Worker.js';
import {BadRequestError, ForbiddenError, NotFoundError} from '../errors/errorClasses.js';
import {generateBaseId, getUniqueId, IObject} from 'shared';

type PopulatedWorker = Omit<InstanceType<typeof Worker>, 'objectRef'> & {
    objectRef: IObject | null;
};

interface CreateWorkerRequest {
    name: string;
    position: string;
    salary_rate: number;
    objectRef: string;
    telegram_username: string;
}

export async function updateWorkerObject(
    workerId: string,
    userObjectId: mongoose.Types.ObjectId | null,
    action: 'assign' | 'unassign'
): Promise<PopulatedWorker> {
    const worker = await Worker.findById(workerId);

    if (!worker) {
    throw new NotFoundError('Worker not found');
}

const currentObjectId = worker.objectRef as unknown as mongoose.Types.ObjectId;

let update: { objectRef: mongoose.Types.ObjectId | null };
if (action === 'assign') {

    if (!userObjectId) {
        throw new ForbiddenError('User has no object assigned');
    }

    if (currentObjectId && currentObjectId.equals(userObjectId)) {
        return populateWorker(worker);
    }
    update = {objectRef: userObjectId};
} else {
    update = {objectRef: null};
}

const updatedWorker = await Worker.findByIdAndUpdate(
    workerId,
    update,
    {new: true, runValidators: true}
).populate('objectRef');
console.log("updatedWorker_service: ", updatedWorker);

if (!updatedWorker) {
    throw new Error('Worker update failed');
}

return populateWorker(updatedWorker);
}

async function populateWorker(worker: InstanceType<typeof Worker>): Promise<PopulatedWorker> {
    return worker.populate<{ objectRef: IObject | null }>('objectRef');
}

export const createWorker = async (
    name: string,
    position: string,
    salary_rate: number,
    objectRef: string,
    telegram_username: string) => {
    const normalizedUsername = telegram_username.replace(/^@/, '');
    const existingWorker = await Worker.findOne({
        telegram_username: normalizedUsername
    });

    if (existingWorker) {
        throw new BadRequestError('Telegram username already exists');
    }

    if (objectRef) {
        const objectExists = await mongoose.model('Object').exists({
            _id: new mongoose.Types.ObjectId(objectRef)
        });
        if (!objectExists) {
            throw new BadRequestError('Объект не найден');
        }
    }

    const baseId = generateBaseId(name);
    const workerId = await getUniqueId(baseId, Worker, "workerId");

    const worker = new Worker({
        workerId,
        name,
        position,
        salary_rate,
        objectRef: objectRef ? new mongoose.Types.ObjectId(objectRef) : null,
        telegram_id: "",
        telegram_username: normalizedUsername,
    });

    await worker.save();
    return populateWorker(worker);
}
