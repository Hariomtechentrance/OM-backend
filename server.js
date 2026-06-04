import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import { setupSecurity } from './middleware/security.js';

// Import routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import storeOrderRoutes from './routes/storeOrderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import shiprocketRoutes from './routes/shiprocketRoutes.js';
import authRoutes from './routes/auth.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import promoBannerRoutes from './routes/promoBannerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

// ✅ CORS - Single block only (fixes duplicate CORS bug)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3018",
  "https://blacklocust.in",
  "https://www.blacklocust.in",
  "https://blacklocust-backend.onrender.com"
];

// Add env-based origins
if (process.env.FRONTEND_URL) {
  const u = process.env.FRONTEND_URL.trim().replace(/\/+$/, "");
  if (u && !allowedOrigins.includes(u)) allowedOrigins.push(u);
}
(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean)
  .forEach((u) => {
    if (!allowedOrigins.includes(u)) allowedOrigins.push(u);
  });

const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (native mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any localhost origin only in development
    if (!isProduction && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Additional middleware
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Trust proxy for Render / PM2 environments
app.set('trust proxy', 1);

// Security hardening (after body parsers)
setupSecurity(app);

// General API rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Strict rate limit for login/register/OTP — 20 attempts per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/send-otp', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/admin/login', authLimiter);

// ✅ All routes registered BEFORE start() is called
app.use('/api/settings', siteSettingsRoutes);
app.use('/api/promo-banner', promoBannerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', storeOrderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shiprocketRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve uploaded files with enhanced CORS for images
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    // Add cache headers for better performance
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.set('Access-Control-Allow-Origin', '*'); // Allow all origins for images
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow cross-origin resource sharing
  }
}));

// Serve public images (hero images, collection images, etc.)
app.use('/images', express.static('public/images', {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.set('Access-Control-Allow-Origin', '*'); // Allow all origins for images
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow cross-origin resource sharing
  }
}));

// Fallback image serving for different paths
app.use('/static', express.static('public', {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours
    res.set('Access-Control-Allow-Origin', '*'); // Allow all origins for images
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow cross-origin resource sharing
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Black Locust API',
    version: '2.0.0',
    status: 'Running',
    features: {
      authentication: 'JWT + 2FA + device tracking',
      authorization: 'Role-based access control',
      payment: 'Stripe + Razorpay + webhook security',
      orderProcessing: 'Atomic transactions + inventory management',
      analytics: 'Real-time + comprehensive reporting',
      notifications: 'Email + SMS + push notifications',
      search: 'Advanced filtering + aggregation',
      security: 'Input sanitization + rate limiting + audit trails'
    },
    endpoints: {
      health: '/api/health',
      authentication: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        profile: '/api/auth/profile',
        'change-password': '/api/auth/change-password',
        'enable-2fa': '/api/auth/enable-2fa',
        activity: '/api/auth/activity',
        'logout-all': '/api/auth/logout-all'
      },
      userManagement: {
        profile: '/api/users/manage/profile',
        analytics: '/api/users/manage/analytics'
      },
      productManagement: {
        search: '/api/products/manage/search',
        categories: '/api/products/manage/categories',
        details: '/api/products/manage/:id',
        reviews: '/api/products/manage/:id/reviews',
        wishlist: '/api/products/manage/:id/wishlist',
        analytics: '/api/products/manage/analytics'
      },
      orders: {
        create: 'POST /api/orders',
        list: 'GET /api/orders/my-orders',
        details: 'GET /api/orders/:orderId',
        cancel: 'PUT /api/orders/:orderId/cancel',
        track: '/api/orders/:orderId/track',
        'status-update': '/api/orders/:orderId/status',
        analytics: '/api/orders/analytics/summary'
      },
      payments: {
        'razorpay-key': 'GET /api/payments/razorpay/key',
        'razorpay-order': 'POST /api/payments/razorpay/order',
        'razorpay-verify': 'POST /api/payments/razorpay/verify'
      },
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Database connection ───────────────────────────────────────────────────────
import createSuperAdmin from './utils/createSuperAdmin.js';
import createAdmin from './seed/createAdmin.js';

const connectDB = async () => {
  try {
    console.log("👉 Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await createSuperAdmin();
    await createAdmin();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // process.exit(1);
  }
};

// ─── Server startup ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);

    // ✅ Keep Render free tier awake - ping every 14 minutes
    if (process.env.NODE_ENV === 'production') {
      const serverUrl = process.env.RENDER_EXTERNAL_URL ||
        'https://om-backend-q11a.onrender.com';

      setInterval(async () => {
        try {
          const res = await fetch(`${serverUrl}/api/health`);
          console.log(`✅ Keep-alive ping: ${res.status}`);
        } catch (err) {
          console.log('⚠️ Keep-alive ping failed:', err.message);
        }
      }, 14 * 60 * 1000); // 14 minutes

      console.log(`🏓 Keep-alive ping started → ${serverUrl}/api/health`);
    }
  });
};

// ✅ start() called LAST - after all routes and handlers are registered
const start = async () => {
  await connectDB();
  startServer();
};

start();