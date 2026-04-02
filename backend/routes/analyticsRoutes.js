const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

// All analytics routes are admin-only
router.get('/dashboard', protect, authorize('admin'), getDashboardAnalytics);
router.get('/sales', protect, authorize('admin'), getSalesAnalytics);
router.get('/products', protect, authorize('admin'), getProductAnalytics);
router.get('/customers', protect, authorize('admin'), getCustomerAnalytics);
router.get('/inventory', protect, authorize('admin'), getInventoryAnalytics);

module.exports = router;
