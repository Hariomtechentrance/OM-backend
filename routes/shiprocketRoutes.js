import express from 'express';
import {
  createShipment,
  trackShipment,
  cancelShipment,
  getAvailableCouriers
} from '../controllers/shiprocketController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create shipment for an order
router.post('/ship-order/:orderId', protect, authorize('admin', 'super admin'), createShipment);

// Track a shipment
router.get('/track/:shipmentId', protect, authorize('admin', 'super admin'), trackShipment);

// Cancel a shipment
router.post('/cancel/:shipmentId', protect, authorize('admin', 'super admin'), cancelShipment);

// Get available couriers for a pincode
router.get('/couriers', protect, authorize('admin', 'super admin'), getAvailableCouriers);

export default router;

