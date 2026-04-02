import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

function getAvailableStock(product) {
  if (typeof product.totalStock === "number") {
    return product.totalStock;
  }
  return (product.sizes || []).reduce((sum, s) => sum + (s.stock || 0), 0);
}

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stock = getAvailableStock(product);
    if (stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        size,
        color,
        quantity,
      });
    }

    await cart.save();

    await cart.populate("items.product", "name price images totalStock sizes");

    res.json({
      success: true,
      message: "Item added to cart",
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((n, i) => n + i.quantity, 0),
        totalAmount: cart.items.reduce(
          (sum, item) =>
            sum +
            (item.product?.price || 0) * item.quantity,
          0
        ),
      },
    });
  } catch (error) {
    console.log("CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    res.json({
      success: true,
      cart: {
        items: cart?.items || [],
        totalItems:
          cart?.items?.reduce((n, i) => n + i.quantity, 0) || 0,
        totalAmount:
          cart?.items?.reduce(
            (sum, item) =>
              sum + (item.product?.price || 0) * item.quantity,
            0
          ) || 0,
      },
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update line quantity (matches frontend uniqueId via productId + size + color)
// @route   PUT /api/cart/line
// @access  Private
export const updateCartLine = async (req, res) => {
  try {
    const { productId, size, color, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid payload" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const stock = getAvailableStock(product);
    if (stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const line = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (!line) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    line.quantity = quantity;
    await cart.save();
    await cart.populate("items.product", "name price images totalStock sizes");

    res.json({
      success: true,
      message: "Cart updated",
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((n, i) => n + i.quantity, 0),
        totalAmount: cart.items.reduce(
          (sum, item) =>
            sum + (item.product?.price || 0) * item.quantity,
          0
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove line
// @route   DELETE /api/cart/line
// @access  Private
export const removeCartLine = async (req, res) => {
  try {
    const { productId, size, color } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();
    await cart.populate("items.product", "name price images totalStock sizes");

    res.json({
      success: true,
      message: "Item removed from cart",
      cart: {
        items: cart.items,
        totalItems: cart.items.reduce((n, i) => n + i.quantity, 0),
        totalAmount: cart.items.reduce(
          (sum, item) =>
            sum + (item.product?.price || 0) * item.quantity,
          0
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: "Cart cleared",
      cart: { items: [], totalItems: 0, totalAmount: 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get cart summary (uses Cart model — same as storefront cart)
// @route   GET /api/cart/summary
// @access  Private
export const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "price stock isActive totalStock sizes name images"
    );

    if (!cart || !cart.items.length) {
      return res.json({
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        totalItems: 0,
      });
    }

    let subtotal = 0;
    let totalItems = 0;
    const availableItems = [];

    for (const cartItem of cart.items) {
      const p = cartItem.product;
      if (p && p.isActive !== false) {
        const itemTotal = p.price * cartItem.quantity;
        subtotal += itemTotal;
        totalItems += cartItem.quantity;
        availableItems.push({
          _id: cartItem._id,
          product: p,
          quantity: cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
          itemTotal,
        });
      }
    }

    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    res.json({
      items: availableItems,
      subtotal,
      tax,
      shipping,
      total,
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
