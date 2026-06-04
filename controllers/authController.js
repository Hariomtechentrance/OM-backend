import User from '../models/userModel.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendOTPEmail } from '../services/emailService.js';

// Generate JWT token
const generateToken = (userId, email, role) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return jwt.sign(
    { userId, email, role },
    secret,
    { expiresIn: '7d' }
  );
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
export const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, profilePicture } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        error: 'Email and Google ID are required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authMethod = 'google';
        user.profilePicture = profilePicture || user.profilePicture;
        user.emailVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        profilePicture,
        authMethod: 'google',
        emailVerified: true,
        isEmailVerified: true,
        role: 'user'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      refreshToken,
      tokenExpiry,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: 'Google login failed',
      message: error.message
    });
  }
};

/**
 * @route   POST /api/auth/facebook
 * @desc    Facebook OAuth login
 * @access  Public
 */
export const facebookLogin = async (req, res) => {
  try {
    const { email, name, facebookId, profilePicture } = req.body;

    if (!email || !facebookId) {
      return res.status(400).json({
        success: false,
        error: 'Email and Facebook ID are required'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update Facebook ID if not set
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.authMethod = 'facebook';
        user.profilePicture = profilePicture || user.profilePicture;
        user.emailVerified = true;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        facebookId,
        profilePicture,
        authMethod: 'facebook',
        emailVerified: true,
        isEmailVerified: true,
        role: 'user'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    res.status(200).json({
      success: true,
      message: 'Facebook login successful',
      token,
      refreshToken,
      tokenExpiry,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(500).json({
      success: false,
      error: 'Facebook login failed',
      message: error.message
    });
  }
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email
 * @access  Public
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ identifier: email });

    // Save OTP to database
    await OTP.create({
      identifier: email,
      otp,
      expiresAt,
      verified: false,
      attempts: 0
    });

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent to your email',
        demo: false
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // If email fails, still return success but in demo mode
      console.log(`Demo Mode - OTP for ${email}: ${otp}`);
      
      res.status(200).json({
        success: true,
        message: 'OTP generated (Demo Mode - check console)',
        demo: true,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP',
      message: error.message
    });
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login/register user
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({
      identifier: email,
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found or already used'
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        error: 'OTP has expired'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        error: 'Too many failed attempts'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP',
        attemptsRemaining: 5 - otpRecord.attempts
      });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        name: email.split('@')[0],
        email,
        authMethod: 'otp',
        emailVerified: true,
        isEmailVerified: true,
        role: 'user'
      });
    } else {
      // Update existing user
      user.emailVerified = true;
      user.isEmailVerified = true;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      refreshToken,
      tokenExpiry,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'OTP verification failed',
      message: error.message
    });
  }
};
