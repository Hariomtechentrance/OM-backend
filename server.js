import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import net from 'net';
import { execSync } from 'child_process';
import 'dotenv/config';

import { setupSecurity } from './middleware/security.js';

// Import only essential routes that exist
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

const app = express();

// CORS - MUST be first middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5002",
  "https://blacklocust-frontend.onrender.com",
  "https://blacklocust.in",
  "https://www.blacklocust.in"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Additional middleware
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Add trust proxy setting for PM2 and proxy environments
app.set('trust proxy', 1);

// Security hardening (CSP/sanitization/etc). Keep it after body parsers.
setupSecurity(app);

// Rate limiting - increased for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // protect against abuse while keeping ecommerce flows working
});
app.use('/api/', limiter);

import createSuperAdmin from './utils/createSuperAdmin.js';
import createAdmin from './seed/createAdmin.js';

// Database connection
const connectDB = async () => {
  try {
    console.log("👉 MONGO_URI:", process.env.MONGO_URI); // DEBUG

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create super admin if none exists
    await createSuperAdmin();
    
    // Create admin if none exists
    await createAdmin();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

// Proper startup sequence - wait for DB before starting server
const start = async () => {
  await connectDB(); // wait for DB
  startServer();     // then start server
};

start();

// Essential Routes
app.use('/api/settings', siteSettingsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', storeOrderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipping', shiprocketRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route - API information
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
      analytics: {
        dashboard: '/api/analytics/dashboard',
        sales: '/api/analytics/sales',
        products: '/api/analytics/products',
        customers: '/api/analytics/customers',
        realtime: '/api/analytics/realtime'
      },
      notifications: {
        welcome: '/api/notifications/welcome',
        'order-confirmation': '/api/notifications/order-confirmation',
        'payment-confirmation': '/api/notifications/payment-confirmation',
        'password-reset': '/api/notifications/password-reset',
        'email-verification': '/api/notifications/email-verification',
        bulk: '/api/notifications/bulk',
        status: '/api/notifications/status/:messageId'
      },
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
      email: '/api/email'
    },
    documentation: 'https://github.com/black-locust/api-docs',
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

// Simple server startup - Render compatible
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};
