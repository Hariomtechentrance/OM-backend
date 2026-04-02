const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/black-locust');

// Define Collection schema
const collectionSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  order: Number,
  isActive: Boolean,
  showInNavbar: Boolean,
  showInFeatured: Boolean,
  showOnHome: Boolean,
  productCount: Number,
  metaTitle: String,
  metaDescription: String,
  parentCollection: mongoose.Schema.Types.ObjectId,
  collectionType: String,
  tags: [String]
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

const Collection = mongoose.model('Collection', collectionSchema);

const realCollections = [
  {
    name: "Denim",
    slug: "denim",
    description: "Quality denim jeans and jackets",
    order: 9,
    isActive: true,
    showInNavbar: true,
    showInFeatured: false,
    showOnHome: false,
    productCount: 0,
    metaTitle: "Denim Collection - Premium Jeans",
    metaDescription: "High-quality denim collection featuring jeans, jackets, and more. Dura…",
    parentCollection: null,
    collectionType: "category",
    tags: ["denim", "jeans", "jackets", "casual"]
  },
  {
    name: "Formal Pants",
    slug: "formal-pants",
    description: "Professional formal pants for business wear",
    order: 10,
    isActive: true,
    showInNavbar: true,
    showInFeatured: false,
    showOnHome: false,
    productCount: 0,
    metaTitle: "Formal Pants - Business Wear",
    metaDescription: "Professional formal pants perfect for business meetings and formal eve…",
    parentCollection: null,
    collectionType: "category",
    tags: ["formal", "business", "pants", "professional"]
  },
  {
    name: "Summer Collection",
    slug: "summer-collection",
    description: "Light and breezy summer outfits",
    order: 11,
    isActive: true,
    showInNavbar: true,
    showInFeatured: false,
    showOnHome: false,
    productCount: 0,
    metaTitle: "Summer Collection - Breezy Outfits",
    metaDescription: "Light and comfortable summer collection. Stay cool and stylish in the …",
    parentCollection: null,
    collectionType: "seasonal",
    tags: ["summer", "light", "breezy", "comfortable"]
  },
  {
    name: "Printed Collection",
    slug: "printed-collection",
    description: "Vibrant printed designs and patterns",
    order: 12,
    isActive: true,
    showInNavbar: true,
    showInFeatured: false,
    showOnHome: false,
    productCount: 0,
    metaTitle: "Printed Collection - Vibrant Designs",
    metaDescription: "Eye-catching printed collection with vibrant patterns and unique desig…",
    parentCollection: null,
    collectionType: "main",
    tags: ["printed", "vibrant", "patterns", "designs"]
  },
  {
    name: "Cargo Collection",
    slug: "cargo-collection",
    description: "Functional cargo pants and utility wear",
    order: 13,
    isActive: true,
    showInNavbar: true,
    showInFeatured: false,
    showOnHome: false,
    productCount: 0,
    metaTitle: "Cargo Collection - Utility Wear",
    metaDescription: "Functional cargo collection with utility pockets and durable materials…",
    parentCollection: null,
    collectionType: "category",
    tags: ["cargo", "utility", "pockets", "durable"]
  }
];

async function updateRealCollections() {
  try {
    console.log('🔥 UPDATING WITH REAL COLLECTIONS...');
    
    // Clear existing collections
    await Collection.deleteMany({});
    console.log('✅ Cleared existing collections');
    
    // Add real collections
    const insertedCollections = await Collection.insertMany(realCollections);
    console.log(`✅ Added ${insertedCollections.length} real collections:`);
    
    insertedCollections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name} (${collection.slug}) - Order: ${collection.order}`);
    });
    
    console.log('\n🎯 DATABASE UPDATED WITH YOUR REAL COLLECTIONS!');
    
  } catch (error) {
    console.error('❌ Error updating collections:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateRealCollections();
