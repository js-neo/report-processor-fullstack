// server/src/models/Object.ts
import { Schema, model } from 'mongoose';
const ObjectSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    geoLocation: { type: String, required: true }
});
const Object = model('Object', ObjectSchema);
export default Object;
//# sourceMappingURL=Object.js.map