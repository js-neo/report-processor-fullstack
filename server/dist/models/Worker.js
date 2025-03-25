// server/src/models/Worker.ts
import { Schema, model } from 'mongoose';
const WorkerSchema = new Schema({
    _id: { type: String, required: true },
    worker_id: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    telegram_id: { type: String, required: true },
    manager_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});
const Worker = model('Worker', WorkerSchema);
export default Worker;
//# sourceMappingURL=Worker.js.map