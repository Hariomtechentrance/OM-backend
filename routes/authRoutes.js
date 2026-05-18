import express from 'express';
import {
  googleLogin,
  facebookLogin,
  sendOTP,
  verifyOTP
} from '../controllers/authController.js';

const router = express.Router();

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.post('/google', googleLogin);

/**
 * @route   POST /api/auth/facebook
 * @desc    Facebook OAuth login
 * @access  Public
 */
router.post('/facebook', facebookLogin);

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email
 * @access  Public
 */
router.post('/send-otp', sendOTP);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login/register user
 * @access  Public
 */
router.post('/verify-otp', verifyOTP);

export default router;
