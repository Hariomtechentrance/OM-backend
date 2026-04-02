const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    // Get total counts
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const orders = await Order.find({ status: 'completed' });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Get recent orders with populated user data
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('user totalAmount status createdAt');
    
    // Get top products (most sold)
    const topProducts = await Product.find()
      .sort({ salesCount: -1 })
      .limit(5)
      .select('name price stock images salesCount');
    
    res.json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get categories with product counts
router.get('/categories-stats', protect, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentCategory', 'name')
      .sort({ order: 1, name: 1 });
    
    // Count products for each category
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          isActive: true 
        });
        
        return {
          ...category.toObject(),
          productCount
        };
      })
    );
    
    const totalCategories = categories.length;
    const activeCategories = categories.filter(cat => cat.isActive).length;
    const totalProducts = categoriesWithStats.reduce((sum, cat) => sum + cat.productCount, 0);
    const avgProductsPerCategory = totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0;
    
    res.json({
      success: true,
      data: {
        categories: categoriesWithStats,
        stats: {
          totalCategories,
          activeCategories,
          totalProducts,
          avgProductsPerCategory
        }
      }
    });
  } catch (error) {
    console.error('Categories stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories statistics'
    });
  }
});

module.exports = router;
