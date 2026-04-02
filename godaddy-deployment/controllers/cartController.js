const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    // Check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get user and update cart
    const user = await User.findById(req.user._id);
    
    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId && 
               item.size === size && 
               item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = user.cart[existingItemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      user.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity,
        size,
        color
      });
    }

    await user.save();

    // Populate cart with product details
    await user.populate('cart.product', 'name price images stock');

    res.json({
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'name price images stock isActive');

    // Filter out inactive products
    const activeCartItems = user.cart.filter(item => 
      item.product && item.product.isActive
    );

    res.json(activeCartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check product stock
    const product = await Product.findById(cartItem.product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await user.save();

    await user.populate('cart.product', 'name price images stock');

    res.json({
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item._id.toString() !== itemId);
    await user.save();

    await user.populate('cart.product', 'name price images stock');

    res.json({
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
exports.getCartSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('cart.product', 'price stock isActive');

    let subtotal = 0;
    let totalItems = 0;
    const availableItems = [];

    for (const cartItem of user.cart) {
      if (cartItem.product && cartItem.product.isActive) {
        const itemTotal = cartItem.product.price * cartItem.quantity;
        subtotal += itemTotal;
        totalItems += cartItem.quantity;
        
        availableItems.push({
          _id: cartItem._id,
          product: cartItem.product,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
          itemTotal
        });
      }
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    res.json({
      items: availableItems,
      subtotal,
      tax,
      shipping,
      total,
      totalItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
