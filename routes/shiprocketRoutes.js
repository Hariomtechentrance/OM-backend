import express from 'express';
import {
  createShipment,
  trackShipment,
  cancelShipment,
  getAvailableCouriers
} from '../controllers/shiprocketController.js';
import { protect, authorize } from '../middleware/auth.js';
import { generateToken } from '../services/shiprocketService.js';

const router = express.Router();

// Test Shiprocket authentication
router.get('/test-shiprocket', async (req, res) => {
  try {
    const token = await generateToken();
    res.json({ 
      success: true, 
      token: token?.substring(0, 50) + '...', // Show partial token for security
      message: 'Shiprocket authentication successful!'
    });
  } catch (error) {
    console.error('Shiprocket test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create shipment for an order
router.post('/ship-order/:orderId', protect, authorize('admin', 'super admin'), createShipment);

// Track a shipment
router.get('/track/:shipmentId', protect, authorize('admin', 'super admin'), trackShipment);

// Cancel a shipment
router.post('/cancel/:shipmentId', protect, authorize('admin', 'super admin'), cancelShipment);

// Get available couriers for a pincode
router.get('/couriers', protect, authorize('admin', 'super admin'), getAvailableCouriers);

export default router;

