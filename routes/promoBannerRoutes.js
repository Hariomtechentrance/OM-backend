import express from 'express';
import {
  getPromoBanner,
  updatePromoBanner,
  togglePromoBanner
} from '../controllers/promoBannerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - get banner
router.get('/', getPromoBanner);

// Admin routes - update and toggle
router.put('/', protect, authorize('admin', 'super admin'), updatePromoBanner);
router.put('/toggle', protect, authorize('admin', 'super admin'), togglePromoBanner);

export default router;
