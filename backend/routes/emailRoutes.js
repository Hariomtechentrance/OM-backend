const express = require('express');
const router = express.Router();
const {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
  sendPromotionalEmail
} = require('../controllers/emailController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/password-reset', sendPasswordResetEmail);

// Protected routes
router.post('/welcome', protect, sendWelcomeEmail);
router.post('/order-confirmation', protect, sendOrderConfirmationEmail);

// Admin routes
router.post('/promotional', protect, authorize('admin'), sendPromotionalEmail);

module.exports = router;
