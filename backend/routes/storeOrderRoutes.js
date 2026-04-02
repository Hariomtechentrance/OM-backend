import express from 'express';
import {
  createOrder,
  cancelOrder,
  getMyOrders,
  getOrderById
} from '../controllers/storeOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id', protect, getOrderById);

export default router;
