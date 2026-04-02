const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '15m' } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    { expiresIn: '7d' } // Long-lived refresh token
  );

  return { accessToken, refreshToken };
};

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your token.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Refresh token middleware
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Calculate expiry time (15 minutes from now)
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    res.json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
      tokenExpiry
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Generate tokens for login/register responses
exports.generateAuthTokens = (userId) => {
  return generateTokens(userId);
};

// Optional: Rate limiting for auth endpoints
exports.authRateLimit = (req, res, next) => {
  // Simple in-memory rate limiting (for production, use Redis)
  const clientIp = req.ip || req.connection.remoteAddress;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per 15 minutes

  // This is a basic implementation - for production use a proper rate limiting library
  if (!req.rateLimit) {
    req.rateLimit = {};
  }

  const key = `auth_${clientIp}`;
  const now = Date.now();
  
  if (!req.rateLimit[key]) {
    req.rateLimit[key] = { count: 1, resetTime: now + windowMs };
  } else {
    if (now > req.rateLimit[key].resetTime) {
      req.rateLimit[key] = { count: 1, resetTime: now + windowMs };
    } else {
      req.rateLimit[key].count++;
      
      if (req.rateLimit[key].count > maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many authentication attempts. Please try again later.',
          retryAfter: Math.ceil((req.rateLimit[key].resetTime - now) / 1000)
        });
      }
    }
  }
  
  next();
};
