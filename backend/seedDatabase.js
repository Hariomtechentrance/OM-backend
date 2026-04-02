const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Premium Party Wear Shirt",
    price: 2999,
    description: "Elegant party wear shirt with premium fabric",
    category: "Shirts",
    subcategory: "party-wear",
    brand: "Black Locust",
    images: [
      { url: "/images/products/party-shirt-1.jpg" },
      { url: "/images/products/party-shirt-2.jpg" }
    ],
    sizes: [
      { name: "S", type: "standard", stock: 10 },
      { name: "M", type: "standard", stock: 15 },
      { name: "L", type: "standard", stock: 12 },
      { name: "XL", type: "standard", stock: 8 }
    ],
    colors: ["Black", "White", "Navy Blue"],
    stock: 45,
    featured: true,
    rating: 4.5,
    numReviews: 23,
    tags: ["party", "formal", "premium"],
    material: "Cotton Blend",
    careInstructions: "Dry clean only"
  },
  {
    name: "Casual Cotton T-Shirt",
    price: 999,
    description: "Comfortable casual t-shirt for everyday wear",
    category: "T-Shirts",
    subcategory: "casual",
    brand: "Black Locust",
    images: [
      { url: "/images/products/casual-tshirt-1.jpg" },
      { url: "/images/products/casual-tshirt-2.jpg" }
    ],
    sizes: [
      { name: "S", type: "standard", stock: 20 },
      { name: "M", type: "standard", stock: 25 },
      { name: "L", type: "standard", stock: 18 },
      { name: "XL", type: "standard", stock: 15 }
    ],
    colors: ["White", "Black", "Gray", "Navy"],
    stock: 78,
    featured: true,
    rating: 4.3,
    numReviews: 45,
    tags: ["casual", "t-shirt", "comfortable"],
    material: "100% Cotton",
    careInstructions: "Machine wash cold"
  },
  {
    name: "Classic Polo T-Shirt",
    price: 1499,
    description: "Classic polo t-shirt with modern styling",
    category: "T-Shirts",
    subcategory: "polo-tshirts",
    brand: "Black Locust",
    images: [
      { url: "/images/products/polo-tshirt-1.jpg" },
      { url: "/images/products/polo-tshirt-2.jpg" }
    ],
    sizes: [
      { name: "S", type: "standard", stock: 12 },
      { name: "M", type: "standard", stock: 18 },
      { name: "L", type: "standard", stock: 15 },
      { name: "XL", type: "standard", stock: 10 }
    ],
    colors: ["White", "Black", "Navy", "Red", "Green"],
    stock: 55,
    featured: true,
    rating: 4.6,
    numReviews: 67,
    tags: ["polo", "t-shirt", "classic"],
    material: "Cotton Pique",
    careInstructions: "Machine wash warm"
  },
  {
    name: "Denim Jeans",
    price: 2499,
    description: "Stylish denim jeans with perfect fit",
    category: "Jeans",
    subcategory: "denim-collection",
    brand: "Black Locust",
    images: [
      { url: "/images/products/denim-jeans-1.jpg" },
      { url: "/images/products/denim-jeans-2.jpg" }
    ],
    sizes: [
      { name: "30", type: "numeric", stock: 15 },
      { name: "32", type: "numeric", stock: 20 },
      { name: "34", type: "numeric", stock: 18 },
      { name: "36", type: "numeric", stock: 12 }
    ],
    colors: ["Blue", "Black", "Gray"],
    stock: 65,
    featured: true,
    rating: 4.7,
    numReviews: 89,
    tags: ["denim", "jeans", "stylish"],
    material: "Denim",
    careInstructions: "Wash inside out"
  },
  {
    name: "Formal Office Pants",
    price: 1999,
    description: "Professional formal pants for office wear",
    category: "Pants",
    subcategory: "formal-pants",
    brand: "Black Locust",
    images: [
      { url: "/images/products/formal-pants-1.jpg" },
      { url: "/images/products/formal-pants-2.jpg" }
    ],
    sizes: [
      { name: "30", type: "numeric", stock: 10 },
      { name: "32", type: "numeric", stock: 15 },
      { name: "34", type: "numeric", stock: 12 },
      { name: "36", type: "numeric", stock: 8 }
    ],
    colors: ["Black", "Gray", "Navy", "Brown"],
    stock: 45,
    featured: true,
    rating: 4.4,
    numReviews: 34,
    tags: ["formal", "office", "professional"],
    material: "Polyester Blend",
    careInstructions: "Dry clean recommended"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Add sample products
    await Product.insertMany(sampleProducts);
    console.log('📦 Added sample products');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@blacklocust.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@blacklocust.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('👤 Created admin user');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
