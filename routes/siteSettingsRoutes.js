import express from 'express';
import { getShopSettings, updateShopSettings } from '../controllers/siteSettingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/shop', getShopSettings);
router.put('/shop', protect, authorize('admin', 'super admin'), updateShopSettings);

export default router;
