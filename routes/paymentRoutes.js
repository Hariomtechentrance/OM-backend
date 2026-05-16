import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCODConfirmationOrder,
  sendUPICollectRequest,
  verifyUPIPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/cod/confirmation-order', protect, createCODConfirmationOrder);
router.post('/razorpay/upi-collect', protect, sendUPICollectRequest);
router.post('/razorpay/verify-upi', protect, verifyUPIPayment);

export default router;
