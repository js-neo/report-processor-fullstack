// packages/server/src/routes/workerRoutes.ts

import {
    createWorkerHandler,
    getAllWorkers,
    updateWorkerObjectHandler
} from '../controllers/workerController.js';
import express from "express";

const router = express.Router();

router.get('/', getAllWorkers);
router.post('/', createWorkerHandler)
router.patch('/:workerId/object', updateWorkerObjectHandler);

export default router;