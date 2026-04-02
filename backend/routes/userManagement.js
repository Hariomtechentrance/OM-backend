const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { 
  validatePassword, 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken,
  generateSecureToken,
  securityConfig 
} = require('../middleware/security');

const router = express.Router();

// Store failed login attempts and sessions
const failedAttempts = new Map();
const userSessions = new Map();

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

// Helper function to manage user sessions
const addUserSession = (userId, sessionId, deviceInfo) => {
  userSessions.set(userId, {
    sessionId,
    loginTime: new Date(),
    lastActivity: new Date(),
    deviceInfo,
    isActive: true
  });
};

const removeUserSession = (userId) => {
  userSessions.delete(userId);
};

const getUserSessions = (userId) => {
  return Array.from(userSessions.values()).filter(session => 
    session.userId === userId && session.isActive
  );
};

// Register new user with comprehensive validation
router.post('/register', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { name, email, password, phone, dateOfBirth, gender } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Name, email, and password are required' 
        });
      }

      // Enhanced email validation
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
      const existingUser = await User.findOne({ 
        $or: [{ email }, { phone }] 
      }).session(session);
      
      if (existingUser) {
        return res.status(409).json({ 
          error: 'User with this email or phone already exists' 
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate verification tokens
      const emailVerificationToken = generateSecureToken();
      const phoneVerificationToken = generateSecureToken();

      // Create new user with enhanced fields
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        twoFactorSecret: generateSecureToken(),
        isEmailVerified: false,
        isPhoneVerified: false,
        emailVerificationToken,
        phoneVerificationToken,
        passwordResetToken: null,
        passwordResetExpires: null,
        lastLogin: null,
        loginAttempts: 0,
        accountLocked: false,
        profile: {
          bio: '',
          preferences: {
            newsletter: true,
            smsNotifications: false,
            emailNotifications: true,
            language: 'en',
            currency: 'INR',
            timezone: 'Asia/Kolkata'
          }
        },
        security: {
          lastPasswordChange: new Date(),
          loginNotifications: true,
          suspiciousActivityAlerts: true,
          twoFactorEnabled: false,
          trustedDevices: []
        }
      });

      await user.save({ session });

      // Send verification emails (mock implementation)
      console.log(`Email verification token for ${email}: ${emailVerificationToken}`);
      console.log(`Phone verification token for ${phone}: ${phoneVerificationToken}`);
      
      // In production, integrate with email/SMS services
      // await emailService.sendVerificationEmail(email, emailVerificationToken);
      // await smsService.sendVerificationSMS(phone, phoneVerificationToken);

      // Generate JWT token
      const token = generateToken({ 
        userId: user._id, 
        email: user.email,
        role: user.role 
      });

      res.status(201).json({
        message: 'User registered successfully. Please verify your email and phone.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        }
      });
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  } finally {
    session.endSession();
  }
});

// Enhanced login with device tracking
router.post('/login', async (req, res) => {
  try {
    const { email, password, twoFactorCode, deviceInfo, rememberMe } = req.body;

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
        remainingTime: `${lockStatus.remainingTime} minutes`,
        unlockTime: new Date(Date.now() + lockStatus.remainingTime * 60000)
      });
    }

    // Find user with security fields
    const user = await User.findOne({ email }).select('+password +twoFactorSecret +loginAttempts +accountLocked +security +lastLogin');
    
    if (!user) {
      recordFailedAttempt(email);
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if account is locked
    if (user.accountLocked) {
      return res.status(423).json({ 
        error: 'Account is locked. Please contact support.',
        lockReason: user.lockReason || 'Too many failed attempts'
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      recordFailedAttempt(email);
      
      // Update user's failed attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= securityConfig.passwordPolicy.maxAttempts) {
        user.accountLocked = true;
        user.lockReason = 'Too many failed login attempts';
        user.lockoutUntil = new Date(Date.now() + securityConfig.passwordPolicy.lockoutDuration);
      }
      await user.save();

      return res.status(401).json({ 
        error: 'Invalid email or password',
        attemptsRemaining: securityConfig.passwordPolicy.maxAttempts - user.loginAttempts
      });
    }

    // Check 2FA if enabled
    if (user.security.twoFactorEnabled && !twoFactorCode) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`2FA Code for ${user.email}: ${code}`);
      
      return res.status(200).json({
        message: '2FA code sent to your registered device',
        requiresTwoFactor: true,
        twoFactorMethod: user.security.preferredTwoFactorMethod || 'email'
      });
    }

    if (user.security.twoFactorEnabled && twoFactorCode) {
      // Verify 2FA code (simplified - in production use TOTP library)
      if (twoFactorCode !== '123456') {
        return res.status(401).json({ 
          error: 'Invalid 2FA code' 
        });
      }
    }

    // Clear failed attempts on successful login
    clearFailedAttempts(email);

    // Update user security info
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    user.accountLocked = false;
    user.lockReason = null;
    user.lockoutUntil = null;

    // Add device to trusted devices if rememberMe
    if (rememberMe && deviceInfo) {
      const deviceFingerprint = generateSecureToken();
      user.security.trustedDevices.push({
        fingerprint: deviceFingerprint,
        deviceInfo,
        lastUsed: new Date(),
        trusted: true
      });
    }

    await user.save();

    // Add session tracking
    const sessionId = generateSecureToken();
    addUserSession(user._id, sessionId, deviceInfo);

    // Generate JWT token
    const token = generateToken({ 
      userId: user._id, 
      email: user.email,
      role: user.role 
    });

    // Generate refresh token
    const refreshToken = generateSecureToken();

    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      sessionId,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        twoFactorEnabled: user.security.twoFactorEnabled,
        lastLogin: user.lastLogin,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

// Get user profile with security info
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -twoFactorSecret');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sessions = getUserSessions(req.user.userId);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        lastLogin: user.lastLogin,
        profile: user.profile,
        security: {
          twoFactorEnabled: user.security.twoFactorEnabled,
          loginNotifications: user.security.loginNotifications,
          suspiciousActivityAlerts: user.security.suspiciousActivityAlerts,
          trustedDevices: user.security.trustedDevices || []
        }
      },
      sessions: sessions.map(session => ({
        sessionId: session.sessionId,
        loginTime: session.loginTime,
        lastActivity: session.lastActivity,
        deviceInfo: session.deviceInfo,
        isActive: session.isActive
      }))
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { name, phone, dateOfBirth, gender, profile } = req.body;
      const userId = req.user.userId;

      const user = await User.findById(userId).session(session);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update allowed fields
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
      if (gender) user.gender = gender;
      
      if (profile) {
        if (profile.bio !== undefined) user.profile.bio = profile.bio;
        if (profile.preferences) {
          user.profile.preferences = {
            ...user.profile.preferences,
            ...profile.preferences
          };
        }
      }

      user.lastModifiedAt = new Date();
      await user.save({ session });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          profile: user.profile
        }
      });
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  } finally {
    session.endSession();
  }
});

// Change password with security checks
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    const user = await User.findById(req.user.userId).select('+password +security');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        error: 'Current password is incorrect' 
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        error: 'New password does not meet security requirements',
        details: passwordValidation.errors
      });
    }

    // Check if new password is same as current
    const isSamePassword = await verifyPassword(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        error: 'New password must be different from current password' 
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and security info
    user.password = hashedPassword;
    user.security.lastPasswordChange = new Date();
    user.security.trustedDevices = []; // Clear trusted devices on password change
    await user.save();

    // Clear all user sessions except current
    const currentSessionId = req.headers['x-session-id'];
    for (const [userId, session] of userSessions.entries()) {
      if (userId === req.user.userId && session.sessionId !== currentSessionId) {
        session.isActive = false;
      }
    }

    res.json({
      message: 'Password changed successfully',
      securityInfo: {
        lastPasswordChange: user.security.lastPasswordChange,
        trustedDevicesCleared: true
      }
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Enable 2FA
router.post('/enable-2fa', async (req, res) => {
  try {
    const { method, phoneNumber, email } = req.body;
    
    const user = await User.findById(req.user.userId).select('+twoFactorSecret +security');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate 2FA code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`2FA Code for ${user.email}: ${code}`);

    // Update user 2FA settings
    user.security.twoFactorEnabled = true;
    user.security.preferredTwoFactorMethod = method || 'email';
    
    if (method === 'sms' && phoneNumber) {
      user.phone = phoneNumber;
    }

    await user.save();

    res.json({ 
      message: '2FA enabled successfully',
      method: user.security.preferredTwoFactorMethod,
      verificationCode: process.env.NODE_ENV === 'development' ? code : undefined // Only show in development
    });

  } catch (error) {
    console.error('2FA enable error:', error);
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
});

// Get user activity log
router.get('/activity', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Mock activity data - in production, store in separate collection
    const activities = [
      {
        type: 'login',
        description: 'Login from Chrome on Windows',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        location: 'Mumbai, India'
      },
      {
        type: 'profile_update',
        description: 'Profile information updated',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        location: 'Mumbai, India'
      },
      {
        type: 'password_change',
        description: 'Password changed',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        location: 'Mumbai, India'
      }
    ];

    const startIndex = skip;
    const endIndex = startIndex + limit;
    const paginatedActivities = activities.slice(startIndex, endIndex);

    res.json({
      activities: paginatedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

// Logout from all devices
router.post('/logout-all', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Clear all user sessions
    for (const [key, session] of userSessions.entries()) {
      if (key === userId) {
        session.isActive = false;
      }
    }
    
    // Update user
    const user = await User.findById(userId);
    if (user) {
      user.security.trustedDevices = [];
      await user.save();
    }

    res.json({ 
      message: 'Logged out from all devices successfully',
      devicesCleared: true
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Failed to logout from all devices' });
  }
});

// Remove trusted device
router.delete('/trusted-devices/:fingerprint', async (req, res) => {
  try {
    const { fingerprint } = req.params;
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('+security');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove device from trusted devices
    user.security.trustedDevices = user.security.trustedDevices.filter(
      device => device.fingerprint !== fingerprint
    );
    
    await user.save();

    res.json({ 
      message: 'Device removed from trusted devices',
      remainingDevices: user.security.trustedDevices.length
    });

  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({ error: 'Failed to remove device' });
  }
});

module.exports = router;
