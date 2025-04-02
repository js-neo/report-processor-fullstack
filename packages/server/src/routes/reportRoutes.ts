// packages/server/src/routes/reportRoutes.ts

import express from 'express';
import {
    getAllReports,
    getWorkerPeriodReports, getObjectPeriodReports
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/workers/:workerName/period', getWorkerPeriodReports);
router.get('/objects/:objectName/period', getObjectPeriodReports);

export default router;