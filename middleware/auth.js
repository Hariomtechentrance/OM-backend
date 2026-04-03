import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // ✅ FIXED IMPORT

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  // Fail fast in production: without these secrets, auth is insecure/unreliable.
  console.error('[auth] Missing JWT_SECRET and/or JWT_REFRESH_SECRET in environment variables.');
}

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
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

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const user = await User.findById(decoded.id).select('-password');

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
    { id: userId },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};
