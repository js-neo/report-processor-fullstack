// packages/server/src/routes/reportRoutes.ts
import express from 'express';
import {
    getAllReports,
    getWorkerPeriodReports,
    getObjectPeriodReports,
    updateReport,
    getAllReportsForPeriod
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/workers/:workerId/period', getWorkerPeriodReports);
router.get('/objects/:objectId/period', getObjectPeriodReports);
router.get('/edit/:objectId/period', getAllReportsForPeriod);
router.patch('/:reportId', updateReport);

export default router;