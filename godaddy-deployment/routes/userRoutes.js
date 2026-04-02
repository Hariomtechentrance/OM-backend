const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  getAllUsers,
  updateUserRole,
  updateUserStatus
} = require('../controllers/userController');
const { protect, authorize, refreshToken: refreshTokenMiddleware } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshTokenMiddleware);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/:id', protect, authorize('admin'), updateUserStatus);

module.exports = router;
