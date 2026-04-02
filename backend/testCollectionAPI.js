// Test the collection API endpoint
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/blacklocust');
import Collection from './models/Collection.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

async function testCollectionAPI() {
  try {
    console.log('🧪 Testing Collection API endpoints...');
    
    // Test Checked Collection
    const checkedCollection = await Collection.findOne({ slug: 'checked-collection' });
    console.log('✅ Checked Collection found:', checkedCollection ? checkedCollection.name : 'Not found');
    
    if (checkedCollection) {
      const checkedProducts = await Product.find({ 
        collection: checkedCollection._id, 
        isActive: true 
      })
      .populate('category', 'name slug')
      .populate('collection', 'name slug');
      
      console.log(`📦 Products in Checked Collection: ${checkedProducts.length}`);
      checkedProducts.forEach(p => console.log(`  - ${p.name}`));
    }
    
    // Test Office Collection
    const officeCollection = await Collection.findOne({ slug: 'office-collection' });
    console.log('✅ Office Collection found:', officeCollection ? officeCollection.name : 'Not found');
    
    if (officeCollection) {
      const officeProducts = await Product.find({ 
        collection: officeCollection._id, 
        isActive: true 
      })
      .populate('category', 'name slug')
      .populate('collection', 'name slug');
      
      console.log(`📦 Products in Office Collection: ${officeProducts.length}`);
      officeProducts.forEach(p => console.log(`  - ${p.name}`));
    }
    
    // Test Party Wear Collection
    const partyCollection = await Collection.findOne({ slug: 'party-wear-collection' });
    console.log('✅ Party Wear Collection found:', partyCollection ? partyCollection.name : 'Not found');
    
    if (partyCollection) {
      const partyProducts = await Product.find({ 
        collection: partyCollection._id, 
        isActive: true 
      })
      .populate('category', 'name slug')
      .populate('collection', 'name slug');
      
      console.log(`📦 Products in Party Wear Collection: ${partyProducts.length}`);
      partyProducts.forEach(p => console.log(`  - ${p.name}`));
    }
    
    // Test the exact API response format
    console.log('\n🔍 Testing API response format...');
    const testCollection = checkedCollection;
    if (testCollection) {
      const products = await Product.find({ 
        collection: testCollection._id, 
        isActive: true 
      })
      .populate('category', 'name slug')
      .populate('collection', 'name slug');
      
      const apiResponse = {
        success: true,
        products: products,
        pagination: {
          current: 1,
          pages: 1,
          total: products.length,
          limit: 20
        }
      };
      
      console.log('📤 API Response structure:');
      console.log(JSON.stringify(apiResponse, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testCollectionAPI();
