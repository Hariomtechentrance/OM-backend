import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Enhanced security configuration
const securityConfig = {
  // Rate limiting
  loginLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts
    message: {
      error: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),
  
  generalLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Password security
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    maxAttempts: 5,
    lockoutDuration: 30 * 60 * 1000 // 30 minutes
  },

  // JWT settings
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
    issuer: 'blacklocust-ecommerce',
    audience: 'blacklocust-users'
  }
};

// Password validation
const validatePassword = (password) => {
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = securityConfig.passwordPolicy;
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Common passwords check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (securityConfig.passwordPolicy.preventCommonPasswords && 
      commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Password cannot contain common words');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate secure tokens
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash password with bcrypt
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, securityConfig.jwtConfig.secret, {
    expiresIn: securityConfig.jwtConfig.expiresIn,
    issuer: securityConfig.jwtConfig.issuer,
    audience: securityConfig.jwtConfig.audience
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, securityConfig.jwtConfig.secret, {
      issuer: securityConfig.jwtConfig.issuer,
      audience: securityConfig.jwtConfig.audience
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Security headers configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      // Allow Razorpay/Stripe hosted checkout scripts used by the frontend.
      scriptSrc: ["'self'", "https://checkout.razorpay.com", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com", "https://api.razorpay.com"],
      frameSrc: ["'self'", "https://js.stripe.com", "https://api.razorpay.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }
  
  // Sanitize URL parameters
  if (req.params) {
    req.params = mongoSanitize(req.params);
  }
  
  next();
};

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;
  
  if (req.method === 'GET') {
    // Generate new CSRF token for GET requests
    if (!req.session) req.session = {};
    req.session.csrfToken = generateSecureToken();
    res.setHeader('X-CSRF-Token', req.session.csrfToken);
    return next();
  }
  
  // Skip CSRF for API endpoints that don't need it
  const skipCSRF = ['/api/users/login', '/api/users/register', '/api/auth/login', '/api/products/manage', '/api/products', '/api/cart', '/api/orders'];
  if (skipCSRF.some(path => req.path.includes(path))) {
    return next();
  }
  
  if (!csrfToken || csrfToken !== sessionToken) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }
  
  next();
};

// IP-based security
const ipSecurity = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  // Log suspicious activity
  if (req.path === '/api/auth/login' && req.method === 'POST') {
    console.log(`Login attempt from IP: ${clientIP}, User-Agent: ${userAgent}`);
  }
  
  // Add security headers
  req.securityContext = {
    clientIP,
    userAgent,
    timestamp: new Date().toISOString()
  };
  
  next();
};

// Order validation
const validateOrder = (orderData) => {
  const errors = [];
  
  // Validate required fields
  if (!orderData.items || orderData.items.length === 0) {
    errors.push('Order must contain at least one item');
  }
  
  if (!orderData.shippingAddress) {
    errors.push('Shipping address is required');
  }
  
  if (!orderData.paymentMethod) {
    errors.push('Payment method is required');
  }
  
  // Validate items
  orderData.items?.forEach((item, index) => {
    if (!item.productId || !item.quantity || !item.price) {
      errors.push(`Item ${index + 1} is missing required fields`);
    }
    
    if (item.quantity <= 0 || item.quantity > 100) {
      errors.push(`Invalid quantity for item ${index + 1}`);
    }
    
    if (item.price < 0 || item.price > 100000) {
      errors.push(`Invalid price for item ${index + 1}`);
    }
  });
  
  // Validate total amount
  const calculatedTotal = orderData.items?.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0) || 0;
  
  if (orderData.totalAmount && Math.abs(orderData.totalAmount - calculatedTotal) > 0.01) {
    errors.push('Order total amount mismatch');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Payment security
const validatePayment = (paymentData) => {
  const errors = [];
  
  // Validate payment method
  const allowedMethods = ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet'];
  if (!allowedMethods.includes(paymentData.method)) {
    errors.push('Invalid payment method');
  }
  
  // Validate amount
  if (paymentData.amount <= 0 || paymentData.amount > 100000) {
    errors.push('Invalid payment amount');
  }
  
  // Check for suspicious patterns
  if (paymentData.amount % 100 === 0 && paymentData.amount > 10000) {
    // Log large round amounts for review
    console.warn('Suspicious payment amount detected:', paymentData);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware setup
const setupSecurity = (app) => {
  // Helmet for security headers
  app.use(helmet(helmetConfig));

  // Rate limiting is handled by server.js (kept centralized to avoid double throttling).
  // app.use('/api/', securityConfig.generalLimiter);
  
  // Data sanitization
  // app.use(sanitizeInput); // Temporarily disabled for debugging
  
  // Prevent parameter pollution
  app.use(hpp());
  
  // IP security
  app.use(ipSecurity);
  
  // CSRF protection disabled temporarily
  // app.use(csrfProtection);
};

export {
  setupSecurity,
  securityConfig,
  validatePassword,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  helmetConfig,
  sanitizeInput,
  csrfProtection,
  ipSecurity,
  validateOrder,
  validatePayment,
  rateLimit
};
