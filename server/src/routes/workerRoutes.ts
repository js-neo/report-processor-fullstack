// server/src/routes/workerRoutes.ts
import express from 'express';
import { getAllWorkers } from '../controllers/workerController.js';

const router = express.Router();

router.get('/', getAllWorkers);

export default router;