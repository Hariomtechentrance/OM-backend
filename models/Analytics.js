import mongoose from 'mongoose';

// User Activity Tracking
const userActivitySchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLoggedIn: { type: Boolean, default: false },
  ipAddress: String,
  userAgent: String,
  device: String, // mobile, tablet, desktop
  browser: String,
  os: String,
  activities: [{
    type: { 
      type: String, 
      enum: ['page_view', 'search', 'product_view', 'add_to_cart', 'checkout', 'purchase', 'login', 'logout', 'signup'],
      required: true 
    },
    page: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    searchQuery: String,
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }],
  firstVisit: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  totalPageViews: { type: Number, default: 0 },
  totalSearches: { type: Number, default: 0 }
}, { timestamps: true });

// Daily Analytics Summary
const dailyAnalyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  visitors: {
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    loggedIn: { type: Number, default: 0 },
    guest: { type: Number, default: 0 }
  },
  pageViews: { type: Number, default: 0 },
  searches: {
    total: { type: Number, default: 0 },
    topQueries: [{ query: String, count: Number }]
  },
  products: {
    viewed: { type: Number, default: 0 },
    addedToCart: { type: Number, default: 0 },
    topViewed: [{ productId: mongoose.Schema.Types.ObjectId, count: Number }]
  },
  sales: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 }
  },
  devices: {
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 }
  },
  browsers: mongoose.Schema.Types.Mixed,
  topPages: [{ page: String, views: Number }]
}, { timestamps: true });

// Search Analytics
const searchAnalyticsSchema = new mongoose.Schema({
  query: { type: String, required: true },
  resultsCount: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  clicked: { type: Boolean, default: false },
  clickedProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const UserActivity = mongoose.model('UserActivity', userActivitySchema);
export const DailyAnalytics = mongoose.model('DailyAnalytics', dailyAnalyticsSchema);
export const SearchAnalytics = mongoose.model('SearchAnalytics', searchAnalyticsSchema);
