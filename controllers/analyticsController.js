import { UserActivity, DailyAnalytics, SearchAnalytics } from '../models/Analytics.js';
import Product from '../models/Product.js';

// Track user activity
export const trackActivity = async (req, res) => {
  try {
    const { sessionId, type, page, productId, searchQuery, metadata } = req.body;
    const userId = req.user?._id;
    const isLoggedIn = !!userId;

    // Get device info from user agent
    const userAgent = req.headers['user-agent'] || '';
    const device = getDeviceType(userAgent);
    const browser = getBrowser(userAgent);
    const os = getOS(userAgent);

    // Find or create user activity session
    let activity = await UserActivity.findOne({ sessionId });

    if (!activity) {
      activity = new UserActivity({
        sessionId,
        userId,
        isLoggedIn,
        ipAddress: req.ip,
        userAgent,
        device,
        browser,
        os,
        activities: []
      });
    }

    // Add new activity
    activity.activities.push({
      type,
      page,
      productId,
      searchQuery,
      metadata,
      timestamp: new Date()
    });

    activity.lastActivity = new Date();
    activity.userId = userId || activity.userId;
    activity.isLoggedIn = isLoggedIn;

    // Update counters
    if (type === 'page_view') activity.totalPageViews++;
    if (type === 'search') activity.totalSearches++;

    await activity.save();

    // Update daily analytics
    await updateDailyAnalytics(type, { sessionId, userId, isLoggedIn, device, browser, page, searchQuery, productId });

    res.json({ success: true, message: 'Activity tracked' });
  } catch (error) {
    console.error('Track activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to track activity' });
  }
};

// Get analytics dashboard data
export const getAnalyticsDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get daily analytics for date range
    const dailyStats = await DailyAnalytics.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    // Calculate totals
    const totals = dailyStats.reduce((acc, day) => ({
      visitors: acc.visitors + day.visitors.total,
      uniqueVisitors: acc.uniqueVisitors + day.visitors.unique,
      loggedInUsers: acc.loggedInUsers + day.visitors.loggedIn,
      guestUsers: acc.guestUsers + day.visitors.guest,
      pageViews: acc.pageViews + day.pageViews,
      searches: acc.searches + day.searches.total,
      productsViewed: acc.productsViewed + day.products.viewed,
      addedToCart: acc.addedToCart + day.products.addedToCart,
      orders: acc.orders + day.sales.totalOrders,
      revenue: acc.revenue + day.sales.totalRevenue
    }), {
      visitors: 0,
      uniqueVisitors: 0,
      loggedInUsers: 0,
      guestUsers: 0,
      pageViews: 0,
      searches: 0,
      productsViewed: 0,
      addedToCart: 0,
      orders: 0,
      revenue: 0
    });

    // Get top searches
    const topSearches = await SearchAnalytics.aggregate([
      { $match: { timestamp: { $gte: start, $lte: end } } },
      { $group: { _id: '$query', count: { $sum: 1 }, clicked: { $sum: { $cond: ['$clicked', 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { query: '$_id', count: 1, clicked: 1, _id: 0 } }
    ]);

    // Get top viewed products
    const topProducts = await UserActivity.aggregate([
      { $match: { lastActivity: { $gte: start, $lte: end } } },
      { $unwind: '$activities' },
      { $match: { 'activities.type': 'product_view', 'activities.productId': { $exists: true } } },
      { $group: { _id: '$activities.productId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Populate product details
    const topProductsWithDetails = await Product.populate(topProducts, { path: '_id' });

    // Get device breakdown
    const deviceStats = dailyStats.reduce((acc, day) => ({
      mobile: acc.mobile + day.devices.mobile,
      tablet: acc.tablet + day.devices.tablet,
      desktop: acc.desktop + day.devices.desktop
    }), { mobile: 0, tablet: 0, desktop: 0 });

    // Get recent activities
    const recentActivities = await UserActivity.find()
      .sort({ lastActivity: -1 })
      .limit(20)
      .populate('userId', 'name email')
      .select('sessionId userId isLoggedIn activities lastActivity device browser');

    // Get conversion rate
    const conversionRate = totals.visitors > 0 ? ((totals.orders / totals.visitors) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totals,
        dailyStats,
        topSearches,
        topProducts: topProductsWithDetails.map(p => ({
          product: p._id,
          views: p.views
        })),
        deviceStats,
        recentActivities,
        conversionRate,
        dateRange: { start, end }
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

// Get user journey
export const getUserJourney = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const activity = await UserActivity.findOne({ sessionId })
      .populate('userId', 'name email')
      .populate('activities.productId', 'name price images');

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Get user journey error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user journey' });
  }
};

// Helper functions
function getDeviceType(userAgent) {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function getBrowser(userAgent) {
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  if (/opera/i.test(userAgent)) return 'Opera';
  return 'Other';
}

function getOS(userAgent) {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
  return 'Other';
}

async function updateDailyAnalytics(type, data) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyAnalytics = await DailyAnalytics.findOne({ date: today });

  if (!dailyAnalytics) {
    dailyAnalytics = new DailyAnalytics({ date: today });
  }

  // Update visitors
  if (type === 'page_view') {
    dailyAnalytics.visitors.total++;
    dailyAnalytics.pageViews++;
    
    if (data.isLoggedIn) {
      dailyAnalytics.visitors.loggedIn++;
    } else {
      dailyAnalytics.visitors.guest++;
    }

    // Update device stats
    if (data.device === 'mobile') dailyAnalytics.devices.mobile++;
    if (data.device === 'tablet') dailyAnalytics.devices.tablet++;
    if (data.device === 'desktop') dailyAnalytics.devices.desktop++;

    // Update browser stats
    if (!dailyAnalytics.browsers) dailyAnalytics.browsers = {};
    dailyAnalytics.browsers[data.browser] = (dailyAnalytics.browsers[data.browser] || 0) + 1;

    // Update top pages
    const pageIndex = dailyAnalytics.topPages.findIndex(p => p.page === data.page);
    if (pageIndex >= 0) {
      dailyAnalytics.topPages[pageIndex].views++;
    } else {
      dailyAnalytics.topPages.push({ page: data.page, views: 1 });
    }
    dailyAnalytics.topPages.sort((a, b) => b.views - a.views);
    dailyAnalytics.topPages = dailyAnalytics.topPages.slice(0, 10);
  }

  // Update search stats
  if (type === 'search' && data.searchQuery) {
    dailyAnalytics.searches.total++;
    
    const queryIndex = dailyAnalytics.searches.topQueries.findIndex(q => q.query === data.searchQuery);
    if (queryIndex >= 0) {
      dailyAnalytics.searches.topQueries[queryIndex].count++;
    } else {
      dailyAnalytics.searches.topQueries.push({ query: data.searchQuery, count: 1 });
    }
    dailyAnalytics.searches.topQueries.sort((a, b) => b.count - a.count);
    dailyAnalytics.searches.topQueries = dailyAnalytics.searches.topQueries.slice(0, 10);
  }

  // Update product stats
  if (type === 'product_view') {
    dailyAnalytics.products.viewed++;
  }
  if (type === 'add_to_cart') {
    dailyAnalytics.products.addedToCart++;
  }

  await dailyAnalytics.save();
}
