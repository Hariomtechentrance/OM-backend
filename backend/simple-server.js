import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import Cart from './models/Cart.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Collection from './models/Collection.js';
import userRoutes from './routes/userRoutes.js';
import { protect } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => {
    console.log('✅ MongoDB Connected');
    console.log('📦 Database: blacklocust');
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Cart Routes (Protected)
app.post('/api/cart/add', protect, async (req, res) => {
  try {
    console.log("🔥 ADD TO CART API HIT");
    console.log("REQ BODY:", req.body);
    
    // ✅ FIX: Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please login to add items to cart."
      });
    }
    
    const { productId, quantity = 1, size, color } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // ✅ FIX: Use authenticated user ID
    const userId = req.user._id;
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

app.get('/api/cart', protect, async (req, res) => {
  try {
    console.log("🔥 GET CART API HIT");
    
    // ✅ FIX: Use authenticated user ID
    const userId = req.user._id;
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

// Products Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, collection, featured, newArrival, trending } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (collection) {
      query.collection = collection;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (newArrival === 'true') {
      query.isNewArrival = true;
    }
    
    if (trending === 'true') {
      query.isTrending = true;
    }
    
    const products = await Product.find(query)
      .populate('category')
      .populate('collection')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      products,
      count: products.length 
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('collection');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Categories and Collections Routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, collections });
  } catch (error) {
    console.error('Collections fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/categories/all', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    const collections = await Collection.find({ isActive: true }).sort({ name: 1 });
    
    // Combine both for admin panel
    const allCategories = [
      ...categories.map(cat => ({ ...cat.toObject(), type: 'category' })),
      ...collections.map(col => ({ ...col.toObject(), type: 'collection' }))
    ];
    
    res.json({ success: true, categories: allCategories });
  } catch (error) {
    console.error('All categories fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// User Routes
app.use('/api/users', userRoutes);

// Root route - API Status
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Black Locust API Server',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      collections: '/api/collections',
      cart: '/api/cart/*'
    },
    database: 'blacklocust',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});
