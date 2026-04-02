const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const net = require('net');
const { setupSecurity } = require('./middleware/security');
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const userManagementRoutes = require('./routes/userManagement');
const productManagementRoutes = require('./routes/productManagement');
const emailNotificationsRoutes = require('./routes/emailNotifications');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// Setup security middleware
setupSecurity(app);

// Additional middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Add trust proxy setting for PM2 and proxy environments
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users/manage', userManagementRoutes);
app.use('/api/products/manage', productManagementRoutes);
app.use('/api/notifications', emailNotificationsRoutes);
app.use('/api/users', wishlistRoutes);

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
        create: '/api/orders/create',
        list: '/api/orders/my-orders',
        details: '/api/orders/:orderId',
        cancel: '/api/orders/:orderId/cancel',
        track: '/api/orders/:orderId/track',
        'status-update': '/api/orders/:orderId/status',
        analytics: '/api/orders/analytics/summary'
      },
      payments: {
        'create-intent': '/api/payments/create-intent',
        confirm: '/api/payments/confirm',
        'stripe-webhook': '/api/payments/stripe-webhook',
        'razorpay-webhook': '/api/payments/razorpay-webhook',
        refund: '/api/payments/refund',
        methods: '/api/payments/methods'
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

const PORT = process.env.PORT || 5002;

// Check if port is already in use
const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port is in use
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true); // Port is available
    });
    
    server.listen(port);
  });
};

const startServer = async () => {
  try {
    const isPortAvailable = await checkPort(PORT);
    
    if (!isPortAvailable) {
      console.log(`⚠️  Port ${PORT} is already in use. Attempting to kill existing process...`);
      try {
        const { execSync } = require('child_process');
        execSync(`lsof -ti:${PORT} | xargs kill -9`, { stdio: 'ignore' });
        console.log(`✅ Killed process on port ${PORT}`);
      } catch (killError) {
        console.log(`❌ Could not kill process on port ${PORT}. Trying alternative port...`);
        // Try alternative port
        const altPort = PORT + 1;
        app.listen(altPort, () => {
          console.log(`🚀 Server running on port ${altPort} (alternative)`);
          console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        return;
      }
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
