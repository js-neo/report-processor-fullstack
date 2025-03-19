// server/src/models/Object.ts
import { Document, Schema, model, Model } from 'mongoose';

interface IObject extends Document {
    _id: string;
    name: string;
    geoLocation: string;
}

const ObjectSchema = new Schema<IObject>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    geoLocation: { type: String, required: true }
});

const Object: Model<IObject> = model<IObject>('Object', ObjectSchema);

export { IObject };
export default Object;