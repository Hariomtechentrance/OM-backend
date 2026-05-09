import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getUserReviews
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.post('/', protect, createReview);
router.put('/:productId', protect, updateReview);
router.delete('/:productId', protect, deleteReview);
router.get('/user', protect, getUserReviews);

export default router;
