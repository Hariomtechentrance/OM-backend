import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCODConfirmationOrder,
  createUPIOrder,
  verifyUPIPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/cod/confirmation-order', protect, createCODConfirmationOrder);
router.post('/razorpay/create-upi-order', protect, createUPIOrder);
router.post('/razorpay/verify-upi', protect, verifyUPIPayment);

export default router;
