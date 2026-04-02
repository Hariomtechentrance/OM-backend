const express = require('express');
const { uploadImage, serveFile } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Upload image endpoint (authentication required)
router.post('/image', protect, authorize('admin'), uploadImage);

// Serve uploaded files
router.get('/categories/:filename', serveFile);

module.exports = router;
