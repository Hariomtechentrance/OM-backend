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

async function checkCollections() {
  try {
    console.log('🔥 CHECKING ACTUAL DATABASE COLLECTIONS...');
    
    const collections = await Collection.find({}).sort({order: 1});
    
    console.log(`\\n📋 FOUND ${collections.length} COLLECTIONS:\\n`);
    
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name} (${col.slug})`);
      console.log(`   Order: ${col.order}`);
      console.log(`   Active: ${col.isActive}`);
      console.log(`   Show in Navbar: ${col.showInNavbar}`);
      console.log(`   Show in Featured: ${col.showInFeatured}`);
      console.log(`   Show on Home: ${col.showOnHome}`);
      console.log(`   Type: ${col.collectionType}`);
      console.log(`   Products: ${col.productCount || 0}`);
      console.log(`---`);
    });
    
    // Check navbar collections specifically
    const navbarCollections = collections.filter(col => col.showInNavbar && col.isActive);
    console.log(`\\n🎯 NAVBAR COLLECTIONS (${navbarCollections.length}):`);
    navbarCollections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name} - Order: ${col.order}`);
    });
    
    // Check featured collections
    const featuredCollections = collections.filter(col => col.showInFeatured && col.isActive);
    console.log(`\\n⭐ FEATURED COLLECTIONS (${featuredCollections.length}):`);
    featuredCollections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name} - Order: ${col.order}`);
    });
    
    // Check home collections
    const homeCollections = collections.filter(col => col.showOnHome && col.isActive);
    console.log(`\\n🏠 HOME PAGE COLLECTIONS (${homeCollections.length}):`);
    homeCollections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name} - Order: ${col.order}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking collections:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkCollections();
