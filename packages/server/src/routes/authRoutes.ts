// packages/server/src/routes/authRoutes.ts
import express from 'express';
import {
    register,
    login,
    authenticate,
    getMe
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/validate', authenticate, (req, res) => {
    console.log('Validate request cookies:', req.cookies);
    console.log('Validate request headers:', req.headers);
    res.json({ valid: true });
});

export default router;