// Update product flags to show featured, new arrivals, and trending sections
import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/blacklocust');
import Product from './models/Product.js';

async function updateProductFlags() {
  try {
    console.log('🔧 Updating product flags for homepage sections...');
    
    // Get all products
    const products = await Product.find({});
    console.log(`📊 Found ${products.length} products to update`);
    
    // Update products with appropriate flags
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Set flags based on product index to distribute across sections
      let updateData = {};
      
      if (i === 0) {
        // First product - Featured and New Arrival
        updateData = {
          isFeatured: true,
          isNewArrival: true,
          isTrending: false
        };
        console.log(`✅ ${product.name} -> Featured + New Arrival`);
      } else if (i === 1) {
        // Second product - Featured and Trending
        updateData = {
          isFeatured: true,
          isNewArrival: false,
          isTrending: true
        };
        console.log(`✅ ${product.name} -> Featured + Trending`);
      } else if (i === 2) {
        // Third product - New Arrival and Trending
        updateData = {
          isFeatured: false,
          isNewArrival: true,
          isTrending: true
        };
        console.log(`✅ ${product.name} -> New Arrival + Trending`);
      } else if (i === 3) {
        // Fourth product - Featured only
        updateData = {
          isFeatured: true,
          isNewArrival: false,
          isTrending: false
        };
        console.log(`✅ ${product.name} -> Featured`);
      } else if (i === 4) {
        // Fifth product - New Arrival only
        updateData = {
          isFeatured: false,
          isNewArrival: true,
          isTrending: false
        };
        console.log(`✅ ${product.name} -> New Arrival`);
      } else if (i === 5) {
        // Sixth product - Trending only
        updateData = {
          isFeatured: false,
          isNewArrival: false,
          isTrending: true
        };
        console.log(`✅ ${product.name} -> Trending`);
      } else {
        // Remaining products - no special flags
        updateData = {
          isFeatured: false,
          isNewArrival: false,
          isTrending: false
        };
        console.log(`✅ ${product.name} -> Regular`);
      }
      
      await Product.updateOne(
        { _id: product._id },
        updateData
      );
    }
    
    // Verify the updates
    console.log('\n🔍 Verification:');
    const featured = await Product.find({ isFeatured: true });
    const newArrivals = await Product.find({ isNewArrival: true });
    const trending = await Product.find({ isTrending: true });
    
    console.log(`📦 Featured Products: ${featured.length}`);
    featured.forEach(p => console.log(`   - ${p.name}`));
    
    console.log(`📦 New Arrivals: ${newArrivals.length}`);
    newArrivals.forEach(p => console.log(`   - ${p.name}`));
    
    console.log(`📦 Trending Products: ${trending.length}`);
    trending.forEach(p => console.log(`   - ${p.name}`));
    
    console.log('\n✅ Product flags updated successfully!');
    console.log('🎯 Homepage sections will now display products');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProductFlags();
