// server/src/models/Worker.ts
import { Document, Schema, model, Model } from 'mongoose';

interface IWorker extends Document {
    _id: string;
    worker_id: string;
    name: string;
    username: string;
    telegram_id: string;
    manager_id: string;
    created_at: Date;
    updated_at: Date;
}

const WorkerSchema = new Schema<IWorker>({
    _id: { type: String, required: true },
    worker_id: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    telegram_id: { type: String, required: true },
    manager_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

const Worker: Model<IWorker> = model<IWorker>('Worker', WorkerSchema);

export { IWorker };
export default Worker;