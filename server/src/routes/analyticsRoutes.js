import express from 'express';
import { getAdminStats } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getAdminStats);

export default router;
