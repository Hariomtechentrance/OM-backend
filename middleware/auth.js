import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { isTokenBlacklisted } from '../utils/tokenBlacklist.js';
import { AUTH_COOKIE } from '../utils/cookieAuth.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('[auth] Missing JWT_SECRET and/or JWT_REFRESH_SECRET in environment variables.');
}

// Protect routes — reads from httpOnly cookie first, falls back to Bearer header
export const protect = async (req, res, next) => {
  // 1. httpOnly cookie (not readable by JS/DevTools — most secure)
  let token = req.cookies?.[AUTH_COOKIE];

  // 2. Authorization header fallback (for mobile apps / direct API calls)
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(503).json({
        success: false,
        message: 'Server auth not configured'
      });
    }

    // Reject blacklisted (logged-out) tokens
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ success: false, message: 'Token has been revoked. Please log in again.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

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

    // ✅ NORMALIZED USER OBJECT (IMPORTANT FIX)
    req.user = {
      _id: user._id,
      id: user._id,
      role: user.role,
      isActive: user.isActive
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Role authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized` 
      });
    }
    next();
  };
};

// Token generator
export const generateAuthTokens = (userId) => {
  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('Auth secrets not configured (JWT_SECRET/JWT_REFRESH_SECRET)');
  }

  const accessToken = jwt.sign(
    { userId: userId }, // ✅ FIXED: Use userId instead of id
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: userId }, // ✅ FIXED: Use userId instead of id
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
