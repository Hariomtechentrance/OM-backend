const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Product = require('../models/Product');
const User = require('../models/User');
const Newsletter = require('../models/Newsletter');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected for seeding'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Sample data
const sampleProducts = [
  {
    name: 'Premium Cotton T-Shirt',
    description: 'High-quality cotton t-shirt with premium finish. Perfect for everyday wear.',
    price: 29.99,
    category: 'T-Shirts',
    brand: 'Black Locust',
    images: [{
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      public_id: 'tshirt_1'
    }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
    stock: 50,
    rating: 4.5,
    featured: true
  },
  {
    name: 'Designer Jeans',
    description: 'Slim fit designer jeans with premium denim. Perfect for casual and semi-formal occasions.',
    price: 89.99,
    category: 'Jeans',
    brand: 'Black Locust',
    images: [{
      url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400',
      public_id: 'jeans_1'
    }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Black'],
    stock: 30,
    rating: 4.8,
    featured: true
  },
  {
    name: 'Leather Jacket',
    description: 'Genuine leather jacket with premium craftsmanship. Timeless style for any season.',
    price: 199.99,
    category: 'Jackets',
    brand: 'Black Locust',
    images: [{
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      public_id: 'jacket_1'
    }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    stock: 15,
    rating: 4.9,
    featured: true
  },
  {
    name: 'Running Shoes',
    description: 'Professional running shoes with advanced cushioning technology. Perfect for athletes and daily runners.',
    price: 129.99,
    category: 'Accessories',
    brand: 'Black Locust',
    images: [{
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      public_id: 'shoes_1'
    }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Red'],
    stock: 25,
    rating: 4.7,
    featured: false
  },
  {
    name: 'Wool Sweater',
    description: 'Warm wool sweater perfect for winter. Soft and comfortable with a classic design.',
    price: 59.99,
    category: 'Sweaters',
    brand: 'Black Locust',
    images: [{
      url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
      public_id: 'sweater_1'
    }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Navy', 'Burgundy'],
    stock: 40,
    rating: 4.6,
    featured: false
  },
  {
    name: 'Designer Watch',
    description: 'Luxury designer watch with premium materials. Perfect accessory for any occasion.',
    price: 299.99,
    category: 'Accessories',
    brand: 'Black Locust',
    images: [{
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      public_id: 'watch_1'
    }],
    sizes: ['M'],
    colors: ['Silver', 'Gold', 'Black'],
    stock: 20,
    rating: 4.8,
    featured: true
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@blacklocust.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Newsletter.deleteMany({});
    
    console.log('✅ Database cleared');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('✅ Products seeded');
    
    // Insert sample users (passwords will be hashed by middleware)
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log('✅ Users seeded');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📦 ${sampleProducts.length} products added`);
    console.log(`👤 ${sampleUsers.length} users added`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
if (process.argv.includes('--seed')) {
  seedDatabase();
} else {
  console.log('Use --seed flag to populate database with sample data');
  console.log('Example: node config/seeder.js --seed');
  process.exit(0);
}