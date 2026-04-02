const mongoose = require('mongoose');

// Connect to blacklocust database
mongoose.connect('mongodb://localhost:27017/blacklocust');

async function checkBlacklocustDB() {
  try {
    console.log('🔥 CHECKING blacklocust DATABASE...');
    
    // List all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`\n📋 FOUND ${collections.length} COLLECTIONS:`);
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Check products collection
    if (collections.find(col => col.name === 'products')) {
      const productsCount = await db.collection('products').countDocuments();
      console.log(`\n📦 PRODUCTS COUNT: ${productsCount}`);
      
      if (productsCount > 0) {
        const products = await db.collection('products').find({}).limit(10).toArray();
        console.log('\n📋 FIRST 10 PRODUCTS:');
        products.forEach((prod, index) => {
          console.log(`${index + 1}. ${prod.name || 'No name'} - $${prod.price || 'No price'}`);
        });
      }
    }
    
    // Check collections collection
    if (collections.find(col => col.name === 'collections')) {
      const collectionsCount = await db.collection('collections').countDocuments();
      console.log(`\n🎯 COLLECTIONS COUNT: ${collectionsCount}`);
      
      if (collectionsCount > 0) {
        const dbCollections = await db.collection('collections').find({}).sort({order: 1}).toArray();
        console.log('\n📋 COLLECTIONS:');
        dbCollections.forEach((col, index) => {
          console.log(`${index + 1}. ${col.name} (${col.slug}) - Order: ${col.order}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking blacklocust database:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkBlacklocustDB();
