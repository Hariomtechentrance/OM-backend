const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Total revenue
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Total orders
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Total customers
    const totalCustomers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Recent orders
    const recentOrders = await Order.find({ createdAt: { $gte: startDate } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isPaid: true
        }
      },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    // Sales over time (last 7 days)
    const salesOverTime = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          isPaid: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      salesOverTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
exports.getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = {};
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    let groupStage;
    switch (groupBy) {
      case 'hour':
        groupStage = {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        };
        break;
      case 'week':
        groupStage = {
          $group: {
            _id: { $week: '$createdAt' },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        };
        break;
      case 'month':
        groupStage = {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        };
        break;
      default: // day
        groupStage = {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 }
          }
        };
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      groupStage,
      { $sort: { _id: 1 } }
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
exports.getProductAnalytics = async (req, res) => {
  try {
    // Top selling products
    const topSelling = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      }
    ]);

    // Low stock products
    const lowStock = await Product.find({ stock: { $lt: 10 } })
      .select('name stock category')
      .sort({ stock: 1 });

    // Products by category
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      topSelling,
      lowStock,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private/Admin
exports.getCustomerAnalytics = async (req, res) => {
  try {
    // New customers over time
    const newCustomers = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Customer demographics
    const totalCustomers = await User.countDocuments();
    const activeCustomers = await User.countDocuments({ isActive: true });
    const customersWithOrders = await Order.distinct('user');

    // Top customers by spending
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      }
    ]);

    res.json({
      totalCustomers,
      activeCustomers,
      customersWithOrders: customersWithOrders.length,
      newCustomers,
      topCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory analytics
// @route   GET /api/analytics/inventory
// @access  Private/Admin
exports.getInventoryAnalytics = async (req, res) => {
  try {
    // Total inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      }
    ]);

    // Stock status
    const inStock = await Product.countDocuments({ stock: { $gt: 0 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lt: 10 } });

    // Category inventory
    const categoryInventory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalStock: { $sum: '$stock' },
          productCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalValue: inventoryValue[0]?.totalValue || 0,
      totalProducts: inventoryValue[0]?.totalProducts || 0,
      totalStock: inventoryValue[0]?.totalStock || 0,
      inStock,
      outOfStock,
      lowStock,
      categoryInventory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
