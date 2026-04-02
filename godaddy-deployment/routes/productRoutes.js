const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/featured', getFeaturedProducts);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Admin routes
router.route('/').post(protect, authorize('admin'), createProduct);
router.route('/:id').put(protect, authorize('admin'), updateProduct);
router.route('/:id').delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
