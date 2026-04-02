import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel.js';
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
    console.log('Registration request body:', req.body);
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: missing fields');
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email format');
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      console.log('Validation failed: password requirements', passwordValidation.errors);
      return res.status(400).json({ 
        error: 'Password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email, 'phone:', phone);
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    console.log('Existing user found:', existingUser);
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email or phone already exists' 
      });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    // Generate 2FA secret
    const twoFactorSecret = generate2FASecret();
    console.log('2FA secret generated');

    // Create new user
    console.log('Creating new user...');
    const user = new User({
      name,
      email,
      password: hashedPassword,
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

    console.log('User object created:', user);

    try {
      const savedUser = await user.save();
      console.log('User saved successfully:', savedUser);

      // Send verification email
      // await emailService.sendVerificationEmail(email, user.emailVerificationToken);

      // Generate JWT token
      const token = generateToken({ 
        userId: user._id, 
        email: user.email,
        role: user.role 
      });

      console.log('Token generated:', token);

      res.status(201).json({
        message: 'User registered successfully',
        token,
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

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
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
      // Verify 2FA code (simplified - in production use TOTP library)
      if (twoFactorCode !== '123456') { // Mock verification
        return res.status(401).json({ 
          success: false,
          error: 'Invalid 2FA code' 
        });
      }
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

    // Generate refresh token
    const refreshToken = generateSecureToken();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
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
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
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

    console.log("✅ Admin login successful");

    const token = jwt.sign(
      { userId: 'admin', role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Admin login successful",
      admin: {
        email,
        role: "admin",
        name: "Admin User"
      },
      token
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
});

// Enable 2FA
router.post('/enable-2fa', async (req, res) => {
  try {
    const { userId, code } = req.body;
    
    const user = await User.findById(userId).select('+twoFactorSecret');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify 2FA code (simplified)
    if (code !== '123456') {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

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

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (token) {
      // Add token to blacklist (simplified - in production use Redis)
      console.log('Token blacklisted:', token);
    }

    res.json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
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

export default router;
