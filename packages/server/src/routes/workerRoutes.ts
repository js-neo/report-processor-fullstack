// packages/server/src/routes/workerRoutes.ts

import {
    getAllWorkers,
    updateWorkerObject
} from '../controllers/workerController.js';
import express from "express";

const router = express.Router();

router.get('/', getAllWorkers);
router.patch('/:workerId/object', updateWorkerObject);

export default router;