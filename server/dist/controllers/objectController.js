// server/src/controllers/objectController.ts
import Object from '../models/Object.js';
import { NotFoundError } from '../errors/errorClasses.js';
export const getAllObjects = async (_req, res, next) => {
    try {
        const objects = await Object.find().select('name object_id').lean();
        if (objects.length === 0) {
            throw new NotFoundError('Объекты не найдены');
        }
        res.json({
            success: true,
            data: objects.map(obj => ({
                _id: obj._id,
                objectName: obj.name
            }))
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=objectController.js.map