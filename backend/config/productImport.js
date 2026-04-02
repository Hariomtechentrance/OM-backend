import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected for product import'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Collection mappings based on product data
const collectionMappings = {
  'checked collection': 'checked-collection',
  'office collection': 'office-collection',
  'party wear collection': 'party-wear-collection',
  'casual collection': 'casual-collection',
  'new collection': 'new-collection',
  'winter collection': 'winter-collection',
  'summer collections': 'summer-collection',
  'polos': 'polos',
  'denim': 'denim',
  'trusers': 'trousers',
  'formal pants': 'formal-pants'
};

// Product data from your list
const products = [
  // Checked Collection
  {
    name: "Men's Slim-Fit Blue Plaid Casual Shirt",
    category: "Shirts",
    collection: "checked collection",
    sku: "BL-SH-013-W/O-042",
    description: "Upgrade your everyday wardrobe with this Men's Slim-Fit Blue Plaid Casual Shirt, designed",
    details: `Fabric: 100% Cotton

Fit: Tailored Fit

Sleeves: Full

Collar: Spread Collar

Pocket: One with logo embroidery

Occasion: Formal & Casual`,
    price: 1099,
    discountedPrice: 350,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"],
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
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 250
  },
  {
    name: "Men's Brown & Black Checked Cotton Casual Shirt",
    category: "Shirts",
    collection: "checked collection",
    sku: "BL-SH-026-W/O-046",
    description: "Men's Brown & Black Checked Cotton Casual Shirt with Full Sleeves, Spread Collar & Dual Chest Pockets",
    details: `Brand Fit Name: Classic
Collar: Spread Collar
Placket: Button Placket
Placket Length: Full
Length: Long Sleeves`,
    price: 2399,
    discountedPrice: 350,
    images: ["https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Brown & Black"],
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: true,
    totalStock: 150
  },
  {
    name: "Men's Black & White Checked Cotton Casual Shirt",
    category: "Shirts",
    collection: "checked collection",
    sku: "BL-SH-013W/O-041",
    description: "A classic black and white checked shirt crafted from soft, breathable cotton. Designed for everyday comfort and versatile styling",
    details: `Brand Fit Name: Classic
Collar: Spread Collar
Placket: Button Placket
Placket Length: Full
Length: Long Sleeves`,
    price: 1999,
    discountedPrice: 350,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 40 },
      { size: "M", stock: 40 },
      { size: "L", stock: 40 },
      { size: "XL", stock: 40 },
      { size: "XXL", stock: 40 }
    ],
    colors: ["Black & White"],
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 200
  },
  // Office Collection
  {
    name: "Grey Pinstripe Cotton Shirt",
    category: "Shirts",
    collection: "office collection",
    sku: "BL-SH-013",
    description: "A sleek, premium cotton shirt featuring subtle white pinstripes for a refined look. Soft, breathable, and perfectly tailored",
    details: `Classic Spread Collar 100% Cotton Casual Shirt – Regular Fit
Color: Grey with White Pinstripes
Fabric: 100% Premium Cotton
Fit: Tailored Fit
Sleeves: Full
Collar: Classic Spread Collar
Pocket: One chest pocket with embroidered logo
Pattern: Vertical Pinstripes
Occasion: Formal & Smart Casual`,
    price: 1549,
    discountedPrice: 330,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 45 },
      { size: "M", stock: 45 },
      { size: "L", stock: 45 },
      { size: "XL", stock: 45 },
      { size: "XXL", stock: 45 }
    ],
    colors: ["Grey Pinstripe"],
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 225
  },
  {
    name: "Maroon Premium Cotton Shirt",
    category: "Shirts",
    collection: "office collection",
    sku: "BL-SH-013-W/O-042",
    description: "Men's Maroon Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    details: `Color: Maroon
Fabric: 100% Premium Cotton
Fit: Tailored Fit
Sleeves: Full Sleeves
Collar: Classic Spread Collar
Pocket: One Chest Pocket with Logo Embroidery
Closure: Button Front
Occasion: Formal & Casual Wear`,
    price: 1099,
    discountedPrice: 330,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 35 },
      { size: "M", stock: 35 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 35 },
      { size: "XXL", stock: 35 }
    ],
    colors: ["Maroon"],
    material: "100% Premium Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 175
  },
  // Party Wear Collection
  {
    name: "Teal Blue Premium Cotton Shirt",
    category: "Shirts",
    collection: "party wear collection",
    sku: "BL-SH-013-W/O-042",
    description: "Men's Teal Blue Premium Cotton Shirt with Full Sleeves, Tailored Fit, Spread Collar & Chest Pocket",
    details: `Brand Fit Name: Classic
Collar: Spread Collar
Placket: Button Placket
Placket Length: Full
Length: Long Sleeves`,
    price: 1599,
    discountedPrice: 330,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 25 },
      { size: "M", stock: 25 },
      { size: "L", stock: 25 },
      { size: "XL", stock: 25 },
      { size: "XXL", stock: 25 }
    ],
    colors: ["Teal Blue"],
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    totalStock: 125
  },
  {
    name: "Men's Black Premium Cotton Shirt",
    category: "Shirts",
    collection: "party wear collection",
    sku: "BL-SH-013-W/O-020",
    description: "Men's Black Premium Cotton Shirt with Full Sleeves, Tailored Fit, and Spread Collar",
    details: `Brand Fit Name: Classic
Collar: Spread Collar
Placket: Button Placket
Placket Length: Full
Length: Long Sleeves`,
    price: 1549,
    discountedPrice: 430,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Black"],
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: true,
    isTrending: true,
    totalStock: 150
  },
  // Polos
  {
    name: "Men's Red Polo T-Shirt",
    category: "Polos",
    collection: "polos",
    sku: "BL-TSH-003-W/O-008/0031",
    description: "Men's Red Polo T-Shirt with Checkered Collar & Sleeve Detailing",
    details: `Brand Fit Name: Classic
Collar: Spread Collar
Placket: Button Placket
Placket Length: Full`,
    price: 1599,
    discountedPrice: 250,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 40 },
      { size: "M", stock: 40 },
      { size: "L", stock: 40 },
      { size: "XL", stock: 40 },
      { size: "XXL", stock: 40 }
    ],
    colors: ["Red"],
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 200
  },
  {
    name: "Men's White Polo T-Shirt",
    category: "Polos",
    collection: "polos",
    sku: "BL-TSH-003-W/O-008/0031",
    description: "Men's White Polo T-Shirt with Contrast Collar & Sleeve Branding",
    details: `Brand Fit Name: Classic
Collar: Spread Collar
Placket: Button Placket
Placket Length: Full`,
    price: 1599,
    discountedPrice: 250,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 45 },
      { size: "M", stock: 45 },
      { size: "L", stock: 45 },
      { size: "XL", stock: 45 },
      { size: "XXL", stock: 45 }
    ],
    colors: ["White"],
    material: "100% Cotton",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 225
  },
  // Denim
  {
    name: "Indigo Blue Straight-Fit Classic Denim Jeans",
    category: "Denim",
    collection: "denim",
    sku: "BL-DNM-012-W/O-056",
    description: "Timeless indigo blue denim crafted in a straight-fit silhouette. Comfortable, durable, and perfect for everyday casual and smart-casual styling.",
    details: `Classic Denim Straight Fit for Men - Regular Size
Closure: Button and zip fly
Waist: Mid-rise
Pockets: multiple utility pockets
Length: Full length
Occasion: Formal/Semi-formal
Closure: Button and zip fly`,
    price: 2499,
    discountedPrice: 650,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 35 },
      { size: "M", stock: 35 },
      { size: "L", stock: 35 },
      { size: "XL", stock: 35 },
      { size: "XXL", stock: 35 }
    ],
    colors: ["Indigo Blue"],
    material: "Denim",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 175
  },
  // Trousers
  {
    name: "Black Textured Straight-Fit Cotton Trousers",
    category: "Trousers",
    collection: "trusers",
    sku: "BL-TR-006-W/O-048",
    description: "Classic black straight-fit trousers made from a soft, breathable textured cotton blend",
    details: `Classic Drawstring Straight Fit Trousers for Men - Regular Size
Closure: Button and zip fly
Waist: Mid-rise
Pockets: multiple utility pockets
Length: Full length
Occasion: Formal/Semi-formal
Closure: Button and zip fly`,
    price: 1249,
    discountedPrice: 550,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop"],
    sizes: [
      { size: "S", stock: 30 },
      { size: "M", stock: 30 },
      { size: "L", stock: 30 },
      { size: "XL", stock: 30 },
      { size: "XXL", stock: 30 }
    ],
    colors: ["Black"],
    material: "Cotton Blend",
    brand: "Black Locust",
    isActive: true,
    isNewArrival: false,
    isTrending: false,
    totalStock: 150
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

// Import function
const importProducts = async () => {
  try {
    console.log('🚀 Starting product import...');

    // Clear existing products and collections
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('🗑️  Clearing existing collections...');
    await Collection.deleteMany({});

    // Create collections first
    console.log('📁 Creating collections...');
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
        // Find the collection for this product
        const collectionKey = productData.collection.toLowerCase();
        const collection = createdCollections[collectionKey];
        
        if (!collection) {
          console.warn(`⚠️  Collection not found for: ${productData.collection}`);
          continue;
        }

        // Create product with collection reference
        const product = new Product({
          ...productData,
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
    console.log(`   - Collections created: ${Object.keys(createdCollections).length}`);
    console.log(`   - Products imported: ${importedCount}`);
    console.log(`   - Total products in database: ${await Product.countDocuments()}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

// Run the import
importProducts();
