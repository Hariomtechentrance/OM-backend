const express = require('express');
const {
  getContent,
  updateContent,
  createContent,
  deleteContent,
  getAllContentTypes,
  getHeroContent,
  saveHeroContent
} = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/hero', getHeroContent);
router.get('/:type/:name', getContent);
router.get('/types', getAllContentTypes);

// Admin routes (authentication required)
router.get('/admin/:type', protect, authorize('admin'), updateContent);
router.post('/', protect, authorize('admin'), createContent);
router.put('/:id', protect, authorize('admin'), updateContent);
router.delete('/:id', protect, authorize('admin'), deleteContent);

// Hero specific routes (authentication required)
router.post('/hero', protect, authorize('admin'), saveHeroContent);

module.exports = router;
