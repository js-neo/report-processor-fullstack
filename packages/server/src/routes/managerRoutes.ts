// packages/server/src/routes/managerRoutes.ts
import { Router } from 'express';
import { updateManagerObject } from '../controllers/managerController.js';
import { authenticate } from '../controllers/authController.js';

const router = Router();

router.patch('/me/object', authenticate, updateManagerObject);

export default router;