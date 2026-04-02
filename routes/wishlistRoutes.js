const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.productId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Transform wishlist items to include product details
    const wishlist = user.wishlist.map(item => {
      const product = item.productId;
      if (!product) return null;
      
      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || product.image,
        addedAt: item.addedAt,
        inStock: product.stock > 0,
        sizes: product.sizes,
        colors: product.colors
      };
    }).filter(Boolean);

    res.json({
      success: true,
      wishlist,
      totalItems: wishlist.length
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add item to wishlist
router.post('/', protect, async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if item already exists in wishlist
    const existingItem = user.wishlist.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    // Add item to wishlist
    const wishlistItem = {
      productId,
      name: name || 'Product',
      price: price || 0,
      image: image || '',
      addedAt: new Date()
    };

    user.wishlist.push(wishlistItem);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      item: wishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove item from wishlist
    user.wishlist = user.wishlist.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// Clear entire wishlist
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
});

// Move item from wishlist to cart
router.post('/:productId/move-to-cart', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, color, quantity = 1 } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find item in wishlist
    const wishlistItem = user.wishlist.find(
      item => item.productId.toString() === productId
    );

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }

    // Add to cart (this would typically integrate with your cart system)
    // For now, we'll just remove from wishlist and return success
    user.wishlist = user.wishlist.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Item moved to cart',
      item: wishlistItem
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({ error: 'Failed to move item to cart' });
  }
});

module.exports = router;
