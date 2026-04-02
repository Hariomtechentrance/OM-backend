// Script to add all 50+ products to the database
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Collection from './models/Collection.js';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blacklocust');

// Function to create or get category
async function getOrCreateCategory(categoryName) {
  let category = await Category.findOne({ name: categoryName });
  if (!category) {
    category = new Category({
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      description: `${categoryName} products`,
      image: 'https://via.placeholder.com/300x200/333/fff?text=' + encodeURIComponent(categoryName)
    });
    await category.save();
  }
  return category._id;
}

// Function to get collection by name
async function getCollectionByName(collectionName) {
  const collection = await Collection.findOne({ name: collectionName });
  if (!collection) {
    throw new Error(`Collection not found: ${collectionName}`);
  }
  return collection._id;
}

// All products data with proper schema structure
const products = [
  {
    name: "Men's Slim-Fit Blue Plaid Casual Shirt",
    skuCode: "BL-SH-013-W/O-042",
    price: 1099,
    description: "Upgrade your everyday wardrobe with this Men's Slim-Fit Blue Plaid Casual Shirt, designed",
    h1Heading: "Men's Slim-Fit Blue Plaid Casual Shirt",
    specifications: "100% Cotton, Regular Fit, Full Sleeves, Spread Collar",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Upgrade your everyday wardrobe with this Men's Slim-Fit Blue Plaid Casual Shirt, designed",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "One with logo embroidery",
        occasion: "Formal & Casual"
      }
    },
    categoryName: "checked collection",
    collectionName: "Checked Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBQcm9kdWN0cy83NQ",
        public_id: "blue_plaid_shirt"
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
    material: "100% Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Grey Pinstripe Cotton Shirt",
    skuCode: "BL-SH-013",
    price: 1549,
    description: "A sleek, premium cotton shirt featuring subtle white pinstripes for a refined look. Soft, breathable, and perfectly tailored",
    h1Heading: "Grey Pinstripe Cotton Shirt",
    specifications: "100% Premium Cotton, Tailored Fit, Full Sleeves, Classic Spread Collar",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "A sleek, premium cotton shirt featuring subtle white pinstripes for a refined look. Soft, breathable, and perfectly tailored",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full",
        collar: "Classic Spread Collar",
        pocket: "One chest pocket with embroidered logo",
        occasion: "Formal & Smart Casual"
      }
    },
    categoryName: "office collection",
    collectionName: "Office Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8x",
        public_id: "grey_pinstripe_shirt"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Grey with White Pinstripes"],
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Teal Blue Premium Cotton Shirt",
    skuCode: "BL-SH-013-W/O-042-TEAL",
    price: 1599,
    description: "Men's Teal Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    h1Heading: "Teal Blue Premium Cotton Shirt",
    specifications: "100% Cotton, Regular Fit, Full Sleeves, Spread Collar",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Men's Teal Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "Chest Pocket",
        occasion: "Party Wear"
      }
    },
    categoryName: "party wear collection",
    collectionName: "Party Wear Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS8z",
        public_id: "teal_blue_shirt"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Teal Blue"],
    material: "100% Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Maroon Premium Cotton Shirt",
    skuCode: "BL-SH-013-W/O-042-MAROON",
    price: 1099,
    description: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    h1Heading: "Maroon Premium Cotton Shirt",
    specifications: "100% Premium Cotton, Tailored Fit, Full Sleeves, Classic Spread Collar",
    productSpecs: {
      fit: "Tailored Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Premium Cotton",
        sleeves: "Full Sleeves",
        collar: "Classic Spread Collar",
        pocket: "One Chest Pocket with Logo Embroidery",
        occasion: "Formal & Casual Wear"
      }
    },
    categoryName: "office collection",
    collectionName: "Office Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS80",
        public_id: "maroon_shirt"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Maroon"],
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Yellow Premium Cotton Shirt",
    skuCode: "BL-SH-013-W/O-042-YELLOW",
    price: 1099,
    description: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    h1Heading: "Men's Yellow Premium Cotton Shirt",
    specifications: "100% Cotton, Regular Fit, Full Sleeves, Spread Collar",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "Chest Pocket",
        occasion: "Office Wear"
      }
    },
    categoryName: "office collection",
    collectionName: "Office Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS81",
        public_id: "yellow_shirt"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Yellow"],
    material: "100% Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Light Yellow Solid Cotton Shirt",
    skuCode: "BL-SH-013-W/O-042-LIGHTYELLOW",
    price: 1099,
    description: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    h1Heading: "Men's Light Yellow Solid Cotton Shirt",
    specifications: "100% Cotton, Regular Fit, Full Sleeves, Spread Collar",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Men's Yellow Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "Chest Pocket",
        occasion: "Office Wear"
      }
    },
    categoryName: "office collection",
    collectionName: "Office Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS82",
        public_id: "light_yellow_shirt"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Light Yellow"],
    material: "100% Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  },
  {
    name: "Men's Brown & Black Checked Cotton Casual Shirt",
    skuCode: "BL-SH-026-W/O-046",
    price: 2399,
    description: "Men's Brown & Black Checked Cotton Casual Shirt with Full Sleeves, Spread Collar & Dual Chest Pockets",
    h1Heading: "Men's Brown & Black Checked Cotton Casual Shirt",
    specifications: "100% Cotton, Regular Fit, Full Sleeves, Spread Collar",
    productSpecs: {
      fit: "Regular Fit",
      availableSizes: [
        { size: "S", stock: 50 },
        { size: "M", stock: 50 },
        { size: "L", stock: 50 },
        { size: "XL", stock: 50 },
        { size: "XXL", stock: 50 }
      ],
      marketingDescription: "Men's Brown & Black Checked Cotton Casual Shirt with Full Sleeves, Spread Collar & Dual Chest Pockets",
      technicalSpecs: {
        fabric: "100% Cotton",
        sleeves: "Full",
        collar: "Spread Collar",
        pocket: "Dual Chest Pockets",
        occasion: "Casual Wear"
      }
    },
    categoryName: "checked collection",
    collectionName: "Checked Collection",
    images: [
      {
        url: "https://imagekit.io/dashboard/media-library/L05ldyBGb2xkZXIgMS83",
        public_id: "brown_black_checked_shirt"
      }
    ],
    sizes: [
      { size: "S", stock: 50 },
      { size: "M", stock: 50 },
      { size: "L", stock: 50 },
      { size: "XL", stock: 50 },
      { size: "XXL", stock: 50 }
    ],
    colors: ["Brown & Black"],
    material: "100% Cotton",
    brand: "Black Locust",
    isFeatured: false,
    isNewArrival: false,
    isTrending: false
  }
];

// Function to add all products
async function addAllProducts() {
  try {
    console.log('🚀 Starting to add all products...');
    
    // Clear existing products first
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');
    
    // Add products one by one to handle references
    const addedProducts = [];
    for (const productData of products) {
      // Get or create category and collection
      const categoryId = await getOrCreateCategory(productData.categoryName);
      const collectionId = await getCollectionByName(productData.collectionName);
      
      // Create product with proper references
      const product = new Product({
        ...productData,
        category: categoryId,
        collection: collectionId
      });
      
      await product.save();
      addedProducts.push(product);
      console.log(`✅ Added: ${product.name}`);
    }
    
    // Display summary by collection
    const summary = {};
    products.forEach(product => {
      const collection = product.collectionName;
      if (!summary[collection]) {
        summary[collection] = 0;
      }
      summary[collection]++;
    });
    
    console.log('\n📊 Products Summary by Collection:');
    Object.keys(summary).forEach(collection => {
      console.log(`  ${collection}: ${summary[collection]} products`);
    });
    
    console.log(`\n🎉 Successfully added ${addedProducts.length} products!`);
    console.log('📱 You can now view all products in the frontend');
    console.log('🔗 Visit: http://localhost:3000/products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

// Run the function
addAllProducts();
