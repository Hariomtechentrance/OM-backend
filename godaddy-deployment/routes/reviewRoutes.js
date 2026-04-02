const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getUserReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:productId', protect, updateReview);
router.delete('/:productId', protect, deleteReview);
router.get('/user', protect, getUserReviews);

module.exports = router;
