// packages/server/src/models/Worker.ts
import { Document, Schema, model, Model } from 'mongoose';

interface IWorker extends Document {
    worker_id: string;
    name: string;
    username: string;
    telegram_id: string;
    managers: string[];
    position: string;
    salary_rate: number;
    created_at: Date;
    updated_at: Date;
}

const WorkerSchema = new Schema<IWorker>({
    worker_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    telegram_id: {
        type: String,
        default: ""
    },
    managers: {
        type: [String],
        required: true
    },
    position: {
        type: String,
        required: true
    },
    salary_rate: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    }
});

WorkerSchema.index({ worker_id: 1 }, { unique: true });

const Worker: Model<IWorker> = model<IWorker>('Worker', WorkerSchema);

export { IWorker };
export default Worker;