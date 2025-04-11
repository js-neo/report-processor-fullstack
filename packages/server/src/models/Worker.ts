// server/src/models/Worker.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IWorker extends Document {
    workerId: string;
    name: string;
    position: string;
    salary_rate: number;
    objectRef: Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}

const WorkerSchema = new Schema<IWorker>(
    {
        workerId: {
            type: String,
            required: [true, 'Worker ID is required'],
            validate: {
                validator: (v: string) => /^[a-z0-9_]{3,30}$/.test(v),
                message: 'Invalid worker ID format (3-30 lowercase letters, numbers and underscores)'
            }
        },
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        position: {
            type: String,
            required: true
        },
        salary_rate: {
            type: Number,
            required: true,
            min: 1
        },
        objectRef: {
            type: Schema.Types.ObjectId,
            ref: 'Object',
            required: true
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function(_, ret) {
                return {
                    workerId: ret.workerId,
                    name: ret.name,
                    position: ret.position,
                    salary_rate: ret.salary_rate,
                    objectRef: ret.objectRef,
                    created_at: ret.created_at,
                    updated_at: ret.updated_at
                };
            }
        }
    }
);

WorkerSchema.index({ workerId: 1 }, { unique: true });
WorkerSchema.index({ objectRef: 1 });

export { IWorker };
export default model<IWorker>('Worker', WorkerSchema);