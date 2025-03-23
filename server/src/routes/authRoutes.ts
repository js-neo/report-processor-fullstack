// server/src/routes/authRoutes.ts

import express from 'express';
import { register, login, authenticate } from '../controllers/authController.ts';
import {asyncHandler} from "../utils/asyncHandler.ts";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
}));

export default router;