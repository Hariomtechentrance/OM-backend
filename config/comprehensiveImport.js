import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected for comprehensive import'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Categories to create
const categories = [
  {
    name: "Shirts",
    slug: "shirts",
    description: "Premium quality shirts for every occasion",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=600&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 1
  },
  {
    name: "Polos",
    slug: "polos",
    description: "Classic polo shirts for versatile styling",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=600&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 2
  },
  {
    name: "Denim",
    slug: "denim",
    description: "Premium denim jeans and jackets",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&h=600&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 3
  },
  {
    name: "Trousers",
    slug: "trousers",
    description: "Formal and casual trousers for every occasion",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=600&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 4
  },
  {
    name: "Winter Collection",
    slug: "winter-collection",
    description: "Warm jackets and winter wear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=400&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 5
  }
];

// Collections to create
const collections = [
  {
    name: "Checked Collection",
    slug: "checked-collection",
    description: "Stylish checked patterns for modern casual wear",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 1
  },
  {
    name: "Office Collection",
    slug: "office-collection",
    description: "Professional shirts perfect for workplace and formal occasions",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 2
  },
  {
    name: "Party Wear Collection",
    slug: "party-wear-collection",
    description: "Elegant shirts designed for special occasions and celebrations",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 3
  },
  {
    name: "Casual Collection",
    slug: "casual-collection",
    description: "Comfortable everyday wear for relaxed style",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 4
  },
  {
    name: "New Collection",
    slug: "new-collection",
    description: "Latest arrivals and trendy designs",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 5
  },
  {
    name: "Winter Collection",
    slug: "winter-collection",
    description: "Warm and cozy options for cold weather",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 6
  },
  {
    name: "Summer Collection",
    slug: "summer-collection",
    description: "Light and breathable for hot weather",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 7
  },
  {
    name: "Polos",
    slug: "polos",
    description: "Classic polo shirts for versatile styling",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 8
  },
  {
    name: "Denim",
    slug: "denim",
    description: "Premium denim jeans and jackets",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 9
  },
  {
    name: "Trousers",
    slug: "trousers",
    description: "Formal and casual trousers for every occasion",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 10
  },
  {
    name: "Formal Pants",
    slug: "formal-pants",
    description: "Professional formal pants for business wear",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=400&fit=crop",
    showInNavbar: true,
    isActive: true,
    order: 11
  }
];

// Sample products matching your schema
const products = [
  {
    name: "Men's Slim-Fit Blue Plaid Casual Shirt",
    description: "Upgrade your everyday wardrobe with this Men's Slim-Fit Blue Plaid Casual Shirt, designed for modern style and comfort.",
    price: 1099,
    discountedPrice: 350,
    skuCode: "BL-SH-013-W/O-042",
    h1Heading: "Men's Slim-Fit Blue Plaid Casual Shirt",
    specifications: "Premium quality cotton shirt with modern plaid pattern",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Upgrade your everyday wardrobe with this Men's Slim-Fit Blue Plaid Casual Shirt, designed for modern style and comfort.",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "One with logo embroidery",
        occasion: "Formal & Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
        public_id: "plaid_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Blue Plaid"],
    totalStock: 250,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["casual", "plaid", "cotton", "slim-fit"],
    collectionName: "checked collection",
    categoryName: "Shirts"
  },
  {
    name: "Grey Pinstripe Cotton Shirt",
    description: "A sleek, premium cotton shirt featuring subtle white pinstripes for a refined look. Soft, breathable, and perfectly tailored.",
    price: 1549,
    discountedPrice: 330,
    skuCode: "BL-SH-013",
    h1Heading: "Grey Pinstripe Cotton Shirt",
    specifications: "Premium cotton shirt with subtle white pinstripes",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 45 },
        { size: "M", stock: 45 },
        { size: "L", stock: 45 },
        { size: "XL", stock: 45 },
        { size: "XXL", stock: 45 }
      ],
      marketingDescription: "A sleek, premium cotton shirt featuring subtle white pinstripes for a refined look. Soft, breathable, and perfectly tailored.",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full",
        collar: "Classic Spread Collar",
        pocket: "One chest pocket with embroidered logo",
        occasion: "Formal & Smart Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "pinstripe_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 45 },
      { size: "M", stock: 45 },
      { size: "L", stock: 45 },
      { size: "XL", stock: 45 },
      { size: "XXL", stock: 45 }
    ],
    colors: ["Grey Pinstripe"],
    totalStock: 225,
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["office", "pinstripe", "formal", "cotton"],
    collectionName: "office collection",
    categoryName: "Shirts"
  },
  {
    name: "Teal Blue Premium Cotton Shirt",
    description: "Men's Teal Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    price: 1599,
    discountedPrice: 330,
    skuCode: "BL-SH-013-W/O-042",
    h1Heading: "Teal Blue Premium Cotton Shirt",
    specifications: "Premium cotton shirt in elegant teal blue",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 25 },
        { size: "M", stock: 25 },
        { size: "L", stock: 25 },
        { size: "XL", stock: 25 },
        { size: "XXL", stock: 25 }
      ],
      marketingDescription: "Men's Teal Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "One chest pocket",
        occasion: "Party Wear"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
        public_id: "teal_shirt_1"
      }
    ],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Teal Blue"],
    totalStock: 125,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    tags: ["party", "teal", "premium", "cotton"],
    collectionName: "party wear collection",
    categoryName: "Shirts"
  },
  {
    name: "Men's Red Polo T-Shirt",
    description: "Men's Red Polo T-Shirt with Checkered Collar & Sleeve Detailing",
    price: 1599,
    discountedPrice: 250,
    skuCode: "BL-TSH-003-W/O-008/0031",
    h1Heading: "Men's Red Polo T-Shirt",
    specifications: "Classic polo shirt with checkered collar detailing",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 40 },
        { size: "M", stock: 40 },
        { size: "L", stock: 40 },
        { size: "XL", stock: 40 },
        { size: "XXL", stock: 40 }
      ],
      marketingDescription: "Men's Red Polo T-Shirt with Checkered Collar & Sleeve Detailing",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "None",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop",
        public_id: "red_polo_1"
      }
    ],
    sizes: [
      { size: "S", stock: 40 },
      { size: "M", stock: 40 },
      { size: "L", stock: 40 },
      { size: "XL", stock: 40 },
      { size: "XXL", stock: 40 }
    ],
    colors: ["Red"],
    totalStock: 200,
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["polo", "red", "casual", "cotton"],
    collectionName: "polos",
    categoryName: "Polos"
  },
  {
    name: "Indigo Blue Straight-Fit Classic Denim Jeans",
    description: "Timeless indigo blue denim crafted in a straight-fit silhouette. Comfortable, durable, and perfect for everyday casual and smart-casual styling.",
    price: 2499,
    discountedPrice: 650,
    skuCode: "BL-DNM-012-W/O-056",
    h1Heading: "Indigo Blue Straight-Fit Classic Denim Jeans",
    specifications: "Classic straight-fit denim jeans in indigo blue",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 35 },
        { size: "M", stock: 35 },
        { size: "L", stock: 35 },
        { size: "XL", stock: 35 },
        { size: "XXL", stock: 35 }
      ],
      marketingDescription: "Timeless indigo blue denim crafted in a straight-fit silhouette. Comfortable, durable, and perfect for everyday casual and smart-casual styling.",
      technicalSpecs: {
        fabric: "Denim",
        sleeves: "Full Length",
        collar: "None",
        pocket: "Multiple utility pockets",
        occasion: "Casual"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop",
        public_id: "indigo_denim_1"
      }
    ],
    sizes: [
      { size: "S", stock: 35 },
      { size: "M", stock: 35 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 35 },
      { size: "XXL", stock: 35 }
    ],
    colors: ["Indigo Blue"],
    totalStock: 175,
    material: "Denim",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["denim", "jeans", "indigo", "straight-fit"],
    collectionName: "denim",
    categoryName: "Denim"
  },
  {
    name: "Black Textured Straight-Fit Cotton Trousers",
    description: "Classic black straight-fit trousers made from a soft, breathable textured cotton blend",
    price: 1249,
    discountedPrice: 550,
    skuCode: "BL-TR-006-W/O-048",
    h1Heading: "Black Textured Straight-Fit Cotton Trousers",
    specifications: "Classic straight-fit trousers in textured cotton",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 30 },
        { size: "M", stock: 30 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 30 },
        { size: "XXL", stock: 30 }
      ],
      marketingDescription: "Classic black straight-fit trousers made from a soft, breathable textured cotton blend",
      technicalSpecs: {
        fabric: "Cotton Blend",
        sleeves: "Full Length",
        collar: "None",
        pocket: "Multiple utility pockets",
        occasion: "Formal/Semi-formal"
      }
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop",
        public_id: "black_trousers_1"
      }
    ],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Black"],
    totalStock: 150,
    material: "Cotton Blend",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    tags: ["trousers", "formal", "black", "textured"],
    collectionName: "trousers",
    categoryName: "Trousers"
  }
];

// Import function
const importAllData = async () => {
  try {
    console.log('🚀 Starting comprehensive data import...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Category.deleteMany({});

    // Create categories first
    console.log('📁 Creating categories...');
    const createdCategories = {};
    
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      createdCategories[categoryData.name.toLowerCase()] = savedCategory;
      console.log(`✅ Created category: ${categoryData.name}`);
    }

    // Create collections
    console.log('📂 Creating collections...');
    const createdCollections = {};
    
    for (const collectionData of collections) {
      const collection = new Collection(collectionData);
      const savedCollection = await collection.save();
      createdCollections[collectionData.name.toLowerCase()] = savedCollection;
      console.log(`✅ Created collection: ${collectionData.name}`);
    }

    // Import products
    console.log('📦 Importing products...');
    let importedCount = 0;
    
    for (const productData of products) {
      try {
        // Find the category and collection for this product
        const categoryKey = productData.categoryName.toLowerCase();
        const collectionKey = productData.collectionName.toLowerCase();
        
        const category = createdCategories[categoryKey];
        const collection = createdCollections[collectionKey];
        
        if (!category) {
          console.warn(`⚠️  Category not found: ${productData.categoryName}`);
          continue;
        }
        
        if (!collection) {
          console.warn(`⚠️  Collection not found: ${productData.collectionName}`);
          continue;
        }

        // Create product with category and collection references
        const product = new Product({
          ...productData,
          category: category._id,
          collection: collection._id
        });

        const savedProduct = await product.save();
        importedCount++;
        console.log(`✅ Imported product: ${productData.name} (${importedCount}/${products.length})`);
        
      } catch (error) {
        console.error(`❌ Error importing product ${productData.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Import completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Categories created: ${Object.keys(createdCategories).length}`);
    console.log(`   - Collections created: ${Object.keys(createdCollections).length}`);
    console.log(`   - Products imported: ${importedCount}`);
    console.log(`   - Total products in database: ${await Product.countDocuments()}`);
    console.log(`   - Total categories in database: ${await Category.countDocuments()}`);
    console.log(`   - Total collections in database: ${await Collection.countDocuments()}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

// Run the import
importAllData();
