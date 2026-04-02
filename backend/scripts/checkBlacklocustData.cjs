const mongoose = require('mongoose');

// Connect to blacklocust database
mongoose.connect('mongodb://localhost:27017/blacklocust');

async function checkBlacklocustData() {
  try {
    console.log('🔥 CHECKING blacklocust DATABASE...');
    
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📋 FOUND ${collections.length} COLLECTIONS:`);
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    // Check products
    if (collections.find(col => col.name === 'products')) {
      const productsCount = await db.collection('products').countDocuments();
      console.log(`\n📦 PRODUCTS COUNT: ${productsCount}`);
      
      if (productsCount > 0) {
        const products = await db.collection('products').find({}).limit(12).toArray();
        console.log('\n📋 FIRST 12 PRODUCTS:');
        products.forEach((prod, index) => {
          console.log(`${index + 1}. ${prod.name || 'No name'} - $${prod.price || 'No price'}`);
        });
      }
    }
    
    // Check collections
    if (collections.find(col => col.name === 'collections')) {
      const collectionsCount = await db.collection('collections').countDocuments();
      console.log(`\n🎯 COLLECTIONS COUNT: ${collectionsCount}`);
      
      if (collectionsCount > 0) {
        const dbCollections = await db.collection('collections').find({}).sort({order: 1}).toArray();
        console.log('\n📋 COLLECTIONS:');
        dbCollections.forEach((col, index) => {
          console.log(`${index + 1}. ${col.name} (${col.slug}) - Order: ${col.order}, Navbar: ${col.showInNavbar}`);
        });
      }
    }
    
    // Check users
    if (collections.find(col => col.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\n👥 USERS COUNT: ${usersCount}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking blacklocust database:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkBlacklocustData();
