const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image to Cloudinary endpoint
exports.uploadImage = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Image upload failed'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer);

      res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
        public_id: result.public_id,
        filename: req.file.originalname
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary upload failed',
      error: error.message
    });
  }
};

// Serve uploaded files
exports.serveFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/categories', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'File not found'
    });
  }
};
