import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import Product from './models/Product.js';
import User from './models/User.js';
import Cart from './models/Cart.js';

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Serve uploaded files - FIXED
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Root route - FIXED
app.get('/', (req, res) => {
  res.send('Backend running successfully 🚀');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running smoothly'
  });
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log("🔥 LOGIN API HIT");
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    console.log("🔥 GET PRODUCTS API HIT");
    const products = await Product.find({ isActive: true });
    res.json({ success: true, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    console.log("🔥 GET PRODUCT API HIT");
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart Routes
app.post('/api/cart/add', async (req, res) => {
  try {
    console.log("🔥 ADD TO CART API HIT");
    console.log("REQ BODY:", req.body);
    
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const userId = "guest";
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId && 
              item.size === size && 
              item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, size, color, quantity });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    console.log("CART SAVED:", cart);

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        totalItems: cart.items.length,
        totalAmount: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    });
  } catch (error) {
    console.log("CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    console.log("🔥 GET CART API HIT");
    
    const userId = "guest";
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    console.log("CART FROM DB:", cart);

    res.json({
      success: true,
      cart: {
        items: cart?.items || [],
        totalItems: cart?.items?.length || 0,
        totalAmount: cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
      }
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: http://localhost:3000`);
  console.log(`🔗 Backend URL: http://localhost:${PORT}`);
});
