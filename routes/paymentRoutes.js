import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCODConfirmationOrder
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/cod/confirmation-order', protect, createCODConfirmationOrder);

export default router;
