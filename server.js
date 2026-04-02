import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

// Import routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import storeOrderRoutes from './routes/storeOrderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/auth.js';

const app = express();

// ─── CORS — MUST be very first middleware ─────────────────────────────────
// Allows: localhost dev, any Render deployment, Vercel, custom domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5002",
  // ✅ ADD YOUR EXACT FRONTEND URL HERE:
  "https://om-frontend-rsti.onrender.com",
  // Old frontend (keep for safety)
  "https://blacklocust-frontend.onrender.com",
  // Custom domains
  "https://blacklocust.in",
  "https://www.blacklocust.in",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps, SSR)
    if (!origin) return callback(null, true);

    // Allow any *.onrender.com subdomain automatically
    if (origin.endsWith('.onrender.com')) return callback(null, true);

    // Allow any *.vercel.app subdomain automatically
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Block everything else
    console.log("❌ Blocked by CORS:", origin);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Handle preflight OPTIONS requests for ALL routes
app.options('*', cors());

// ─── Security & Performance ───────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ─── Database Connection ──────────────────────────────────────────────────────
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
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/products',    productRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/auth',        authRoutes);
app.use('/api/cart',        cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/categories',  categoryRoutes);
app.use('/api/orders',      storeOrderRoutes);
app.use('/api/payments',    paymentRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ name: 'Black Locust API', version: '2.0.0', status: 'Running' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')} + *.onrender.com + *.vercel.app`);
  });
};

start();
