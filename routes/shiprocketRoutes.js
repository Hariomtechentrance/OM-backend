import express from 'express';
import { protect } from '../middleware/auth.js';
import { createShiprocketShipment } from '../controllers/shiprocketController.js';

const router = express.Router();

// Creates Shiprocket adhoc shipment for an existing StoreOrder.
router.post('/shiprocket/shipment', protect, createShiprocketShipment);

export default router;

