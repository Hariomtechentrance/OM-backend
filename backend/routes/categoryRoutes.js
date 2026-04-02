import express from 'express';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getCategoryTree,
  getNavbarCategories,
  getHomeCategories,
  getFeaturedCategories
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/navbar', getNavbarCategories);
router.get('/home', getHomeCategories);
router.get('/featured', getFeaturedCategories);

// ✅ Dynamic route LAST - after all specific routes
router.get('/:slug', getCategory);

// Admin routes (authentication required)
router.post('/', protect, authorize('admin'), createCategory);
router.put('/reorder', protect, authorize('admin'), reorderCategories); // ✅ reorder before /:id
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
