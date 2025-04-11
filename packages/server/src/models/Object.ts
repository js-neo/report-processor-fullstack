// server/src/models/Object.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IObject extends Document {
    _id: Types.ObjectId;
    objectId: string;
    name: string;
    address: string;
    coordinates: string;
    managers: Types.ObjectId[];
    workers: Types.ObjectId[];
    created_at: Date;
    updated_at: Date;
}

function convertObjectIdsToStrings(ids?: Types.ObjectId[]): string[] {
    return ids?.map((id: Types.ObjectId) => id.toString()) || [];
}

const ObjectSchema = new Schema<IObject>(
    {
        objectId: {
            type: String,
            required: [true, 'Object ID is required'],
            validate: {
                validator: (v: string) => /^[a-z0-9_]{3,30}$/.test(v),
                message: 'Invalid object ID format (3-30 lowercase letters, numbers and underscores)'
            }
        },
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: String,
            required: true
        },
        managers: [{
            type: Schema.Types.ObjectId,
            ref: 'Manager'
        }],
        workers: [{
            type: Schema.Types.ObjectId,
            ref: 'Worker'
        }]
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
                    _id: ret._id.toString(),
                    objectId: ret.objectId,
                    name: ret.name,
                    address: ret.address,
                    coordinates: ret.coordinates,
                    managers: convertObjectIdsToStrings(ret.managers),
                    workers: convertObjectIdsToStrings(ret.workers),
                    created_at: ret.created_at,
                    updated_at: ret.updated_at
                };
            },
        }
    }
);

ObjectSchema.index({ objectId: 1 }, { unique: true });
ObjectSchema.index({ name: 1 });

export { IObject };
export default model<IObject>('Object', ObjectSchema);