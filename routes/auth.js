import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookieAuth.js';
import { 
  validatePassword, 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  generateSecureToken,
  securityConfig 
} from '../middleware/security.js';

const router = express.Router();

// Store failed login attempts
const failedAttempts = new Map();

// Helper function to check account lockout
const isAccountLocked = (email) => {
  const attempts = failedAttempts.get(email) || { count: 0, lastAttempt: null };
  
  if (attempts.count >= securityConfig.passwordPolicy.maxAttempts) {
    const lockoutTime = securityConfig.passwordPolicy.lockoutDuration;
    const timeSinceLastAttempt = Date.now() - new Date(attempts.lastAttempt).getTime();
    
    if (timeSinceLastAttempt < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - timeSinceLastAttempt) / 60000);
      return { locked: true, remainingTime };
    }
  }
  
  return { locked: false };
};

// Helper function to record failed attempt
const recordFailedAttempt = (email) => {
  const attempts = failedAttempts.get(email) || { count: 0, lastAttempt: null };
  attempts.count += 1;
  attempts.lastAttempt = new Date();
  failedAttempts.set(email, attempts);
};

// Helper function to clear failed attempts
const clearFailedAttempts = (email) => {
  failedAttempts.delete(email);
};

// Generate 2FA secret
const generate2FASecret = () => {
  return crypto.randomBytes(20).toString('base64');
};

// Send 2FA code via email (mock implementation)
const send2FACode = async (email, code) => {
  console.log(`2FA Code for ${email}: ${code}`);
  // In production, integrate with email service like SendGrid, Nodemailer, etc.
  // await emailService.send2FACode(email, code);
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input — enforce string types to prevent object injection after sanitisation
    if (!name || !email || !password ||
        typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
            return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or phone already exists' });
    }

    const twoFactorSecret = generate2FASecret();
    const user = new User({
      name,
      email,
      password, // Plain password - model's pre-save hook will hash it
      phone,
      twoFactorSecret,
      isEmailVerified: false,
      emailVerificationToken: generateSecureToken(),
      passwordResetToken: null,
      passwordResetExpires: null,
      lastLogin: null,
      loginAttempts: 0,
      accountLocked: false
    });


    try {
      const savedUser = await user.save();

      // Send verification email
      // await emailService.sendVerificationEmail(email, user.emailVerificationToken);

      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      // Set httpOnly cookie — JS/DevTools cannot read this
      setAuthCookie(res, token);

      res.status(201).json({
        message: 'User registered successfully',
        token, // also returned for native/mobile clients
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      });
    } catch (saveError) {
      console.error('Error saving user to database:', saveError);
      console.error('Save error details:', {
        name: saveError.name,
        message: saveError.message,
        errors: saveError.errors
      });
      res.status(500).json({ 
        error: 'Database error during user registration',
        details: saveError.message
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
});

// Login with enhanced security
router.post('/login', async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if account is locked
    const lockStatus = isAccountLocked(email);
    if (lockStatus.locked) {
      return res.status(423).json({ 
        error: 'Account temporarily locked due to too many failed attempts',
        remainingTime: `${lockStatus.remainingTime} minutes`
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password +twoFactorSecret +loginAttempts +accountLocked');
    
    if (!user) {
      recordFailedAttempt(email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Check if account is locked
    if (user.accountLocked) {
      return res.status(423).json({ 
        error: 'Account is locked. Please contact support.' 
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      recordFailedAttempt(email);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled && !twoFactorCode) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await send2FACode(user.email, code);
      
      return res.status(200).json({
        message: '2FA code sent to your email',
        requiresTwoFactor: true
      });
    }

    if (user.twoFactorEnabled && twoFactorCode) {
      // Verify OTP stored in DB (sent to user's email/phone during the 2FA challenge step)
      const otpRecord = await OTP.findOne({
        identifier: user.email,
        otp: twoFactorCode,
        verified: false,
        expiresAt: { $gt: new Date() }
      });
      if (!otpRecord) {
        return res.status(401).json({ success: false, error: 'Invalid or expired 2FA code' });
      }
      otpRecord.verified = true;
      await otpRecord.save();
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(email);

    // Update last login
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    await user.save();

    // Generate JWT token
    const token = generateToken({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    });

    const refreshToken = generateSecureToken();

    // Set httpOnly cookie — inaccessible to JavaScript and DevTools
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // also returned for native/mobile clients
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    console.log("🔥 ADMIN LOGIN API HIT");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Fixed admin credentials
    if (email !== "admin@blacklocust.com" || password !== "admin123") {
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials"
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(503).json({ success: false, error: 'Server not configured' });

    const token = jwt.sign(
      { userId: 'admin', role: 'admin' },
      secret,
      { expiresIn: '7d' }
    );

    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Admin login successful',
      admin: { email, role: 'admin', name: 'Admin User' },
      token
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Enable 2FA — requires a valid OTP sent to user's email
router.post('/enable-2fa', async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ error: 'userId and code are required' });

    const user = await User.findById(userId).select('+twoFactorSecret');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otpRecord = await OTP.findOne({
      identifier: user.email,
      otp: code,
      verified: false,
      expiresAt: { $gt: new Date() }
    });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }
    otpRecord.verified = true;
    await otpRecord.save();

    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token (simplified - in production store in database)
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new access token
    const token = generateToken({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    });

    res.json({ token });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

import { blacklistToken } from '../utils/tokenBlacklist.js';

// Logout — clears httpOnly cookie AND blacklists token
router.post('/logout', async (req, res) => {
  try {
    const cookieToken = req.cookies?.bl_sid;
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : req.body?.token;

    blacklistToken(cookieToken || headerToken);
    clearAuthCookie(res);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists
      return res.json({ 
        message: 'If an account exists with this email, a reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send reset email
    // await emailService.sendPasswordResetEmail(email, resetToken);

    res.json({ 
      message: 'Password reset link sent to your email' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        error: 'Reset token and new password are required' 
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'Password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.loginAttempts = 0;
    user.accountLocked = false;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid verification token' 
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// SOCIAL & OTP LOGIN ROUTES
// ============================================================================

import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.post('/google', async (req, res) => {
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
    const token = generateToken({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    });
    const refreshToken = generateSecureToken();
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
});

/**
 * @route   POST /api/auth/facebook
 * @desc    Facebook OAuth login
 * @access  Public
 */
router.post('/facebook', async (req, res) => {
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
    const token = generateToken({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    });
    const refreshToken = generateSecureToken();
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
});

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email or phone
 * @access  Public
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;
    const isMobile = Boolean(phone);
    const identifier = isMobile ? phone : email;

    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Email or phone is required' });
    }

    if (isMobile) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ success: false, error: 'Enter a valid 10-digit Indian mobile number' });
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email format' });
      }
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.deleteMany({ identifier });
    await OTP.create({ identifier, otp, expiresAt, verified: false, attempts: 0 });

    try {
      if (isMobile) {
        const result = await sendOTPSMS(phone, otp);
        res.status(200).json({
          success: true,
          message: result.demo ? 'OTP generated (check server console)' : `OTP sent to +91 ${phone}`,
          demo: result.demo
        });
      } else {
        await sendOTPEmail(email, otp);
        res.status(200).json({ success: true, message: 'OTP sent to your email', demo: false });
      }
    } catch (deliveryError) {
      console.error('OTP delivery error:', deliveryError);
      console.log(`Demo Mode - OTP for ${identifier}: ${otp}`);
      res.status(200).json({
        success: true,
        message: 'OTP generated (check server console)',
        demo: true
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP', message: error.message });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login/register user (email or phone)
 * @access  Public
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const isMobile = Boolean(phone);
    const identifier = isMobile ? phone : email;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, error: 'Identifier (email or phone) and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ identifier, verified: false }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'OTP not found or already used' });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, error: 'OTP has expired' });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, error: 'Too many failed attempts' });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP',
        attemptsRemaining: 5 - otpRecord.attempts
      });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    let user;
    if (isMobile) {
      user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({
          name: `User${phone.slice(-4)}`,
          phone,
          authMethod: 'otp',
          phoneVerified: true,
          role: 'user'
        });
      } else {
        user.phoneVerified = true;
        await user.save();
      }
    } else {
      user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: email.split('@')[0],
          email,
          authMethod: 'otp',
          emailVerified: true,
          isEmailVerified: true,
          role: 'user'
        });
      } else {
        user.emailVerified = true;
        user.isEmailVerified = true;
        await user.save();
      }
    }

    const token = generateToken({ userId: user._id, email: user.email, role: user.role });
    const refreshToken = generateSecureToken();
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await OTP.deleteOne({ _id: otpRecord._id });
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      refreshToken,
      tokenExpiry,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phone: user.phone || null,
        role: user.role,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, error: 'OTP verification failed', message: error.message });
  }
});

/**
 * @route   POST /api/auth/phone-otp-login
 * @desc    Login/register after Firebase Phone OTP verification
 * @access  Public
 */
router.post('/phone-otp-login', async (req, res) => {
  try {
    const { idToken, phone } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, error: 'Firebase ID token is required' });
    }

    // Verify the Firebase ID token using Google Identity Toolkit REST API
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Firebase Web API key not configured on server' });
    }

    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      }
    );

    const verifyData = await verifyRes.json();

    if (verifyData.error || !verifyData.users?.[0]) {
      return res.status(401).json({ success: false, error: 'Invalid or expired Firebase token' });
    }

    const fbUser = verifyData.users[0];
    const firebasePhone = fbUser.phoneNumber; // e.g. "+919876543210"
    const localPhone = firebasePhone.replace(/^\+91/, '');

    // Find or create user
    let user = await User.findOne({ phone: localPhone });

    if (!user) {
      user = await User.create({
        name: `User${localPhone.slice(-4)}`,
        phone: localPhone,
        authMethod: 'otp',
        phoneVerified: true,
        role: 'user'
      });
    } else {
      if (!user.phoneVerified) {
        user.phoneVerified = true;
        await user.save();
      }
    }

    const token = generateToken({ userId: user._id, email: user.email, role: user.role });
    const refreshToken = generateSecureToken();
    const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    res.status(200).json({
      success: true,
      message: 'Phone login successful',
      token,
      refreshToken,
      tokenExpiry,
      user: {
        id: user._id,
        name: user.name,
        email: user.email || null,
        phone: user.phone,
        role: user.role,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Phone OTP login error:', error);
    res.status(500).json({ success: false, error: 'Phone login failed', message: error.message });
  }
});

export default router;
