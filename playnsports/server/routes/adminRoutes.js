import express from 'express';
import adminProtect from '../middleware/adminMiddleware.js';
import { getAllCoaches, approveCoach, rejectCoach, getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', adminProtect, getDashboardStats);
router.get('/coaches', adminProtect, getAllCoaches);
router.patch('/coaches/:id/approve', adminProtect, approveCoach);
router.patch('/coaches/:id/reject', adminProtect, rejectCoach);

export default router;