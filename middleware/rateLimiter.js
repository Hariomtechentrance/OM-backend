const rateLimit = require('express-rate-limit');

// General rate limiting for all requests
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Strict rate limiting for sensitive endpoints
const strictLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests
  'Too many login attempts. Please try again after 15 minutes.'
);

// Moderate rate limiting for API endpoints
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests. Please try again later.'
);

// Password reset rate limiting (very strict)
const passwordResetLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 requests
  'Too many password reset attempts. Please try again after 1 hour.'
);

// Email verification rate limiting
const emailVerificationLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  5, // 5 requests
  'Too many verification attempts. Please try again after 1 hour.'
);

// Registration rate limiting
const registrationLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // 3 registrations
  'Too many registration attempts. Please try again after 1 hour.'
);

module.exports = {
  strictLimiter,
  apiLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
  registrationLimiter
};
