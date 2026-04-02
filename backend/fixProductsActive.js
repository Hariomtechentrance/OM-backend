// Script to fix products isActive field
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/blacklocust');
import Product from './models/Product.js';
import Collection from './models/Collection.js';

async function fixProductsActive() {
  try {
    console.log('🔧 Fixing products isActive field...');
    
    // Update all products to ensure isActive is true
    const result = await Product.updateMany(
      { isActive: { $exists: false } },
      { isActive: true }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products with isActive field`);
    
    // Also update any products with isActive: false to true
    const result2 = await Product.updateMany(
      { isActive: false },
      { isActive: true }
    );
    
    console.log(`✅ Reactivated ${result2.modifiedCount} products`);
    
    // Check final state
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalProducts = await Product.countDocuments();
    
    console.log(`📊 Total products: ${totalProducts}`);
    console.log(`📊 Active products: ${activeProducts}`);
    
    // Test API query
    const products = await Product.find({ isActive: true })
      .populate('collection', 'name slug');
    
    console.log('🔍 Active products with collections:');
    products.forEach(p => {
      console.log(`- ${p.name} -> ${p.collection ? p.collection.name : 'No collection'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProductsActive();
