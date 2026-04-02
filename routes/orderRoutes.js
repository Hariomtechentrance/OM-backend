const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  updateOrder,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);

// Admin routes (must be before '/:id' route)
router.get('/admin/all', protect, authorize('admin'), getAllOrders);

router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id', protect, authorize('admin'), updateOrder);

module.exports = router;
