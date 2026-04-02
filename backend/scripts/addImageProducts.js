const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Product data from images
const productsData = [
  // Arrivals Collection
  {
    name: 'Summer Arrival Collection',
    description: 'Premium summer collection featuring lightweight fabrics and breathable designs. Perfect for warm weather with modern styling and comfort.',
    price: 89.99,
    category: 'T-Shirts',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/arrivals/11.jpg',
        public_id: 'arrivals_11'
      },
      {
        url: '/images/arrivals/12.jpg',
        public_id: 'arrivals_12'
      },
      {
        url: '/images/arrivals/13.jpg',
        public_id: 'arrivals_13'
      }
    ],
    sizes: [
      { name: 'S', type: 'standard', stock: 50 },
      { name: 'M', type: 'standard', stock: 75 },
      { name: 'L', type: 'standard', stock: 60 },
      { name: 'XL', type: 'standard', stock: 40 }
    ],
    colors: ['White', 'Navy', 'Black', 'Gray'],
    stock: 225,
    featured: true,
    rating: 4.8,
    numReviews: 127,
    tags: ['summer', 'arrival', 'trending'],
    isActive: true
  },
  {
    name: 'Casual Weekend Collection',
    description: 'Comfortable and stylish casual wear perfect for weekend outings. Made from premium cotton blends with modern fits.',
    price: 79.99,
    category: 'Jeans',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/arrivals/14.jpg',
        public_id: 'arrivals_14'
      },
      {
        url: '/images/arrivals/32.jpg',
        public_id: 'arrivals_32'
      }
    ],
    sizes: [
      { name: '28', type: 'standard', stock: 35 },
      { name: '30', type: 'standard', stock: 50 },
      { name: '32', type: 'standard', stock: 45 },
      { name: '34', type: 'standard', stock: 30 }
    ],
    colors: ['Blue', 'Black', 'Gray'],
    stock: 160,
    featured: true,
    rating: 4.6,
    numReviews: 89,
    tags: ['casual', 'weekend', 'comfortable'],
    isActive: true
  },
  
  // Shop Collection
  {
    name: 'Premium Urban Collection',
    description: 'Modern urban fashion with contemporary designs. Features premium materials and cutting-edge street style.',
    price: 129.99,
    category: 'Jackets',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/shop/20.jpg',
        public_id: 'shop_20'
      },
      {
        url: '/images/shop/21.jpg',
        public_id: 'shop_21'
      }
    ],
    sizes: [
      { name: 'S', type: 'standard', stock: 25 },
      { name: 'M', type: 'standard', stock: 40 },
      { name: 'L', type: 'standard', stock: 35 },
      { name: 'XL', type: 'standard', stock: 20 }
    ],
    colors: ['Black', 'Brown', 'Navy'],
    stock: 120,
    featured: true,
    rating: 4.9,
    numReviews: 203,
    tags: ['urban', 'premium', 'modern'],
    isActive: true
  },
  {
    name: 'Street Style Essentials',
    description: 'Essential streetwear pieces for every wardrobe. Combines comfort with urban aesthetics.',
    price: 99.99,
    category: 'Sweaters',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/shop/22.jpg',
        public_id: 'shop_22'
      },
      {
        url: '/images/shop/23.jpg',
        public_id: 'shop_23'
      }
    ],
    sizes: [
      { name: 'S', type: 'standard', stock: 45 },
      { name: 'M', type: 'standard', stock: 60 },
      { name: 'L', type: 'standard', stock: 55 },
      { name: 'XL', type: 'standard', stock: 30 }
    ],
    colors: ['Gray', 'Navy', 'Burgundy'],
    stock: 190,
    featured: true,
    rating: 4.7,
    numReviews: 156,
    tags: ['street', 'essentials', 'versatile'],
    isActive: true
  },
  {
    name: 'Professional Executive Line',
    description: 'Sophisticated executive wear for the modern professional. Premium materials with tailored fits.',
    price: 149.99,
    category: 'Accessories',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/shop/24.jpg',
        public_id: 'shop_24'
      }
    ],
    sizes: [
      { name: 'M', type: 'standard', stock: 30 }
    ],
    colors: ['Silver', 'Gold', 'Black'],
    stock: 30,
    featured: true,
    rating: 4.8,
    numReviews: 94,
    tags: ['professional', 'executive', 'formal'],
    isActive: true
  },
  
  // Collections Gallery
  {
    name: 'Seasonal Essentials Collection',
    description: 'Curated seasonal pieces featuring the best of contemporary fashion. Versatile items for any occasion.',
    price: 119.99,
    category: 'T-Shirts',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/collections/24.jpg',
        public_id: 'collections_24'
      },
      {
        url: '/images/collections/25.jpg',
        public_id: 'collections_25'
      },
      {
        url: '/images/collections/26.jpg',
        public_id: 'collections_26'
      }
    ],
    sizes: [
      { name: 'S', type: 'standard', stock: 40 },
      { name: 'M', type: 'standard', stock: 60 },
      { name: 'L', type: 'standard', stock: 50 },
      { name: 'XL', type: 'standard', stock: 35 }
    ],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    stock: 185,
    featured: true,
    rating: 4.6,
    numReviews: 267,
    tags: ['seasonal', 'essentials', 'versatile'],
    isActive: true
  },
  {
    name: 'Limited Edition Premium',
    description: 'Exclusive limited edition pieces featuring premium materials and unique designs. Collectible items.',
    price: 199.99,
    category: 'Jackets',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/collections/27.jpg',
        public_id: 'collections_27'
      },
      {
        url: '/images/collections/28.jpg',
        public_id: 'collections_28'
      }
    ],
    sizes: [
      { name: 'S', type: 'standard', stock: 15 },
      { name: 'M', type: 'standard', stock: 25 },
      { name: 'L', type: 'standard', stock: 20 }
    ],
    colors: ['Black', 'Brown', 'Burgundy'],
    stock: 60,
    featured: true,
    rating: 5.0,
    numReviews: 89,
    tags: ['limited', 'edition', 'premium', 'exclusive'],
    isActive: true
  },
  {
    name: 'Urban Street Fusion',
    description: 'Fusion of urban street style with contemporary fashion elements. Bold designs for statement makers.',
    price: 89.99,
    category: 'Jeans',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/collections/29.jpg',
        public_id: 'collections_29'
      }
    ],
    sizes: [
      { name: '28', type: 'standard', stock: 30 },
      { name: '30', type: 'standard', stock: 45 },
      { name: '32', type: 'standard', stock: 40 }
    ],
    colors: ['Blue', 'Black', 'Gray'],
    stock: 115,
    featured: true,
    rating: 4.5,
    numReviews: 178,
    tags: ['urban', 'street', 'fusion', 'bold'],
    isActive: true
  },
  {
    name: 'Classic Heritage Line',
    description: 'Timeless designs inspired by heritage fashion with modern twists. Classic pieces with contemporary appeal.',
    price: 139.99,
    category: 'Sweaters',
    brand: 'Black Locust',
    images: [
      {
        url: '/images/collections/30.jpg',
        public_id: 'collections_30'
      },
      {
        url: '/images/collections/31.jpg',
        public_id: 'collections_31'
      }
    ],
    sizes: [
      { name: 'S', type: 'standard', stock: 35 },
      { name: 'M', type: 'standard', stock: 50 },
      { name: 'L', type: 'standard', stock: 45 },
      { name: 'XL', type: 'standard', stock: 25 }
    ],
    colors: ['Gray', 'Navy', 'Burgundy'],
    stock: 155,
    featured: false,
    rating: 4.4,
    numReviews: 234,
    tags: ['classic', 'heritage', 'timeless'],
    isActive: true
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Add products to database
const addProducts = async () => {
  try {
    // Clear existing products (optional - remove if you want to keep existing data)
    // await Product.deleteMany({});
    
    // Add new products
    const products = await Product.insertMany(productsData);
    
    console.log(`✅ Successfully added ${products.length} products to database`);
    console.log('📊 Products added:', products.map(p => p.name));
    
    // Close connection
    mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error adding products:', error);
  }
};

// Run the script
addProducts();
