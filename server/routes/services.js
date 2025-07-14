import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getProviderServices,
  approveService
} from '../controllers/serviceController.js'; 

import { protect, isProvider, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Provider routes
router.post('/', protect, isProvider, createService);
router.get('/provider/mine', protect, isProvider, getProviderServices);
router.put('/:id', protect, isProvider, updateService);
router.delete('/:id', protect, isProvider, deleteService);

// Admin approval route
router.put('/:id/approve', protect, isAdmin, approveService);

export default router;