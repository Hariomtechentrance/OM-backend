const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes are protected
router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.get('/summary', protect, getCartSummary);
router.put('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;
