const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentMethods,
  handleWebhook,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/methods', protect, getPaymentMethods);

router.get('/razorpay/key', protect, getRazorpayKey);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// Admin routes
router.post('/refund', protect, authorize('admin'), processRefund);

module.exports = router;
