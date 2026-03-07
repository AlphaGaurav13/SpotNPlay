import express from 'express';
import {
  createGround,
  getMyGrounds,
  getNearbyGrounds,
  getGroundById,
  addSlots,
  deleteGround,
} from '../controllers/groundController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('ground_owner'), createGround);
router.get('/my', protect, authorizeRoles('ground_owner'), getMyGrounds);
router.get('/nearby', protect, getNearbyGrounds);
router.get('/:id', protect, getGroundById);
router.post('/:id/slots', protect, authorizeRoles('ground_owner'), addSlots);
router.delete('/:id', protect, authorizeRoles('ground_owner'), deleteGround);

export default router;