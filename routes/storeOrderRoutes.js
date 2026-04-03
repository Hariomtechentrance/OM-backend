import express from 'express';
import {
  createOrder,
  cancelOrder,
  getMyOrders,
  getOrderById,
  getOrderTrack,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/storeOrderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/admin/all', protect, authorize('admin', 'super admin'), getAllOrdersAdmin);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/status', protect, authorize('admin', 'super admin'), updateOrderStatusAdmin);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id/track', protect, getOrderTrack);
router.get('/:id', protect, getOrderById);

export default router;
