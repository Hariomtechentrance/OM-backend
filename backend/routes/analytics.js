const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Get comprehensive dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.orderDate = {};
      if (startDate) dateFilter.orderDate.$gte = new Date(startDate);
      if (endDate) dateFilter.orderDate.$lte = new Date(endDate);
    }

    // Get orders analytics
    const orderAnalytics = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          statusBreakdown: {
            $push: {
              status: '$status',
              count: 1
            }
          },
          paymentMethodBreakdown: {
            $push: {
              method: '$paymentMethod',
              amount: '$totalAmount'
            }
          }
        }
      }
    ]);

    // Get products analytics
    const productAnalytics = await Product.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: '$price' },
          avgPrice: { $avg: '$price' },
          lowStockItems: {
            $sum: {
              $cond: {
                if: { $lte: ['$sizes.stock', 5] },
                then: 1,
                else: 0
              }
            }
          },
          outOfStockItems: {
            $sum: {
              $cond: {
                if: { $eq: ['$sizes.stock', 0] },
                then: 1,
                else: 0
              }
            }
          }
        }
      }
    ]);

    // Get users analytics
    const userAnalytics = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: {
            $sum: {
              $cond: {
                if: '$isEmailVerified',
                then: 1,
                else: 0
              }
            }
          },
          usersWith2FA: {
            $sum: {
              $cond: {
                if: '$security.twoFactorEnabled',
                then: 1,
                else: 0
              }
            }
          }
        }
      }
    ]);

    // Get recent activity
    const recentOrders = await Order.find(dateFilter)
      .sort({ orderDate: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .lean();

    const recentUsers = await User.find({})
      .sort({ lastLogin: -1 })
      .limit(10)
      .select('name email lastLogin role')
      .lean();

    // Calculate growth metrics
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const monthlyGrowth = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: null,
          monthlyOrders: { $sum: 1 },
          monthlyRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const weeklyGrowth = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: null,
          weeklyOrders: { $sum: 1 },
          weeklyRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      overview: {
        orders: orderAnalytics[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
          statusBreakdown: [],
          paymentMethodBreakdown: []
        },
        products: productAnalytics[0] || {
          totalProducts: 0,
          totalValue: 0,
          avgPrice: 0,
          lowStockItems: 0,
          outOfStockItems: 0
        },
        users: userAnalytics[0] || {
          totalUsers: 0,
          verifiedUsers: 0,
          usersWith2FA: 0
        }
      },
      growth: {
        monthly: monthlyGrowth[0] || { monthlyOrders: 0, monthlyRevenue: 0 },
        weekly: weeklyGrowth[0] || { weeklyOrders: 0, weeklyRevenue: 0 }
      },
      recentActivity: {
        orders: recentOrders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          amount: order.totalAmount,
          status: order.status,
          customer: order.userId?.name || 'Unknown',
          date: order.orderDate
        })),
        users: recentUsers.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          lastLogin: user.lastLogin,
          role: user.role
        }))
      }
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

// Sales analytics with detailed breakdown
router.get('/sales', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { 
      startDate, 
      endDate, 
      groupBy = 'day',
      category, 
      paymentMethod 
    } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.orderDate = {};
      if (startDate) dateFilter.orderDate.$gte = new Date(startDate);
      if (endDate) dateFilter.orderDate.$lte = new Date(endDate);
    }

    // Additional filters
    if (category) {
      dateFilter['items.productId.category'] = category;
    }
    
    if (paymentMethod) {
      dateFilter.paymentMethod = paymentMethod;
    }

    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = {
          year: { $year: '$orderDate' },
          month: { $month: '$orderDate' },
          day: { $dayOfMonth: '$orderDate' },
          hour: { $hour: '$orderDate' }
        };
        break;
      case 'day':
        groupFormat = {
          year: { $year: '$orderDate' },
          month: { $month: '$orderDate' },
          day: { $dayOfMonth: '$orderDate' }
        };
        break;
      case 'week':
        groupFormat = {
          year: { $year: '$orderDate' },
          week: { $week: '$orderDate' }
        };
        break;
      case 'month':
        groupFormat = {
          year: { $year: '$orderDate' },
          month: { $month: '$orderDate' }
        };
        break;
      case 'year':
        groupFormat = {
          year: { $year: '$orderDate' }
        };
        break;
      default:
        groupFormat = {
          year: { $year: '$orderDate' },
          month: { $month: '$orderDate' },
          day: { $dayOfMonth: '$orderDate' }
        };
    }

    const salesData = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupFormat,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
          uniqueCustomers: { $addToSet: '$userId' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 }
      }
    ]);

    res.json({
      salesData: salesData.map(item => ({
        period: item._id,
        totalOrders: item.totalOrders,
        totalRevenue: item.totalRevenue,
        avgOrderValue: Math.round(item.avgOrderValue * 100) / 100,
        uniqueCustomers: item.uniqueCustomers.length
      })),
      summary: {
        totalRevenue: salesData.reduce((sum, item) => sum + item.totalRevenue, 0),
        totalOrders: salesData.reduce((sum, item) => sum + item.totalOrders, 0),
        avgOrderValue: Math.round(
          salesData.reduce((sum, item) => sum + item.avgOrderValue, 0) / salesData.length * 100
        ) / 100
      }
    });

  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
});

// Product performance analytics
router.get('/products', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { startDate, endDate, limit = 10, sortBy = 'soldCount' } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'soldCount':
        sortOptions = { soldCount: -1 };
        break;
      case 'revenue':
        sortOptions = { totalRevenue: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'views':
        sortOptions = { viewCount: -1 };
        break;
      case 'wishlist':
        sortOptions = { wishlistedCount: -1 };
        break;
      default:
        sortOptions = { soldCount: -1 };
    }

    const productPerformance = await Product.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'items.productId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalRevenue: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: {
                  $multiply: [
                    { $arrayElemAt: ['$order.items', 0] },
                    { $size: '$order.items' }
                  ]
                }
              }
            }
          },
          soldCount: { $size: '$orders' },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: sortOptions },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      products: productPerformance.map(product => ({
        id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        soldCount: product.soldCount || 0,
        totalRevenue: product.totalRevenue || 0,
        avgRating: Math.round(product.avgRating * 10) / 10,
        viewCount: product.viewCount || 0,
        wishlistedCount: product.wishlistedCount || 0,
        stockStatus: product.sizes?.some(size => size.stock > 0) ? 'inStock' : 'outOfStock'
      })),
      summary: {
        totalProducts: productPerformance.length,
        totalRevenue: productPerformance.reduce((sum, p) => sum + (p.totalRevenue || 0), 0),
        totalSold: productPerformance.reduce((sum, p) => sum + (p.soldCount || 0), 0)
      }
    });

  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch product analytics' });
  }
});

// Customer analytics
router.get('/customers', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { startDate, endDate, limit = 20, sortBy = 'lastLogin' } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.lastLogin = {};
      if (startDate) dateFilter.lastLogin.$gte = new Date(startDate);
      if (endDate) dateFilter.lastLogin.$lte = new Date(endDate);
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'lastLogin':
        sortOptions = { lastLogin: -1 };
        break;
      case 'orders':
        sortOptions = { orderCount: -1 };
        break;
      case 'spent':
        sortOptions = { totalSpent: -1 };
        break;
      default:
        sortOptions = { lastLogin: -1 };
    }

    const customerAnalytics = await User.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          totalSpent: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: '$order.totalAmount'
              }
            }
          },
          avgOrderValue: {
            $avg: {
              $map: {
                input: '$orders',
                as: 'order',
                in: '$order.totalAmount'
              }
            }
          },
          lastOrderDate: { $max: '$orders.orderDate' }
        }
      },
      { $sort: sortOptions },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      customers: customerAnalytics.map(customer => ({
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: customer.role,
        isEmailVerified: customer.isEmailVerified,
        isPhoneVerified: customer.isPhoneVerified,
        twoFactorEnabled: customer.security?.twoFactorEnabled || false,
        joinDate: customer.createdAt,
        lastLogin: customer.lastLogin,
        orderCount: customer.orderCount || 0,
        totalSpent: customer.totalSpent || 0,
        avgOrderValue: customer.avgOrderValue ? Math.round(customer.avgOrderValue * 100) / 100 : 0,
        lastOrderDate: customer.lastOrderDate
      })),
      summary: {
        totalCustomers: customerAnalytics.length,
        totalSpent: customerAnalytics.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
        avgOrdersPerCustomer: customerAnalytics.length > 0 
          ? Math.round(customerAnalytics.reduce((sum, c) => sum + (c.orderCount || 0), 0) / customerAnalytics.length * 100) / 100
          : 0
      }
    });

  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch customer analytics' });
  }
});

// Real-time analytics
router.get('/realtime', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get real-time stats
    const [
      todayStats,
      weekStats,
      monthStats,
      activeUsers,
      pendingOrders,
      lowStockProducts
    ] = await Promise.all([
      // Today's stats
      Order.aggregate([
        { $match: { orderDate: { $gte: today } } },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      
      // This week's stats
      Order.aggregate([
        { $match: { orderDate: { $gte: thisWeek } } },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      
      // This month's stats
      Order.aggregate([
        { $match: { orderDate: { $gte: thisMonth } } },
        {
          $group: {
            _id: null,
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]),
      
      // Active users (last 30 days)
      User.countDocuments({
        lastLogin: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
      }),
      
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      
      // Low stock products
      Product.countDocuments({ 'sizes.stock': { $lte: 5 } })
    ]);

    res.json({
      realtime: {
        today: todayStats[0] || { orders: 0, revenue: 0 },
        thisWeek: weekStats[0] || { orders: 0, revenue: 0 },
        thisMonth: monthStats[0] || { orders: 0, revenue: 0 },
        activeUsers: activeUsers,
        pendingOrders: pendingOrders,
        lowStockProducts: lowStockProducts
      },
      alerts: {
        lowStock: lowStockProducts > 0,
        highPendingOrders: pendingOrders > 50,
        newUsers: activeUsers > 100 // Threshold for alert
      }
    });

  } catch (error) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch real-time analytics' });
  }
});

module.exports = router;
