import mongoose from 'mongoose';
import Product from './models/Product.js';

mongoose.connect('mongodb://localhost:27017/blacklocust')
  .then(async () => {
    console.log('✅ Connected to blacklocust database');
    
    try {
      const products = await Product.find({});
      console.log(`Found ${products.length} products to update`);
      
      for (const product of products) {
        // Update with sample sizes, colors, and stock
        const updates = {
          sizes: [
            { size: 'S', stock: Math.floor(Math.random() * 20) + 5 },
            { size: 'M', stock: Math.floor(Math.random() * 25) + 10 },
            { size: 'L', stock: Math.floor(Math.random() * 20) + 8 },
            { size: 'XL', stock: Math.floor(Math.random() * 15) + 3 },
            { size: 'XXL', stock: Math.floor(Math.random() * 10) + 1 }
          ],
          colors: ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue'],
          totalStock: Math.floor(Math.random() * 100) + 50,
          stock: Math.floor(Math.random() * 100) + 50,
          isFeatured: Math.random() > 0.7,
          isNewArrival: Math.random() > 0.8,
          isTrending: Math.random() > 0.6,
          rating: (Math.random() * 2 + 3).toFixed(1),
          numReviews: Math.floor(Math.random() * 50) + 10,
          material: 'Premium Cotton Blend',
          careInstructions: 'Machine wash cold, tumble dry low',
          tags: ['casual', 'comfortable', 'stylish']
        };
        
        await Product.findByIdAndUpdate(product._id, updates);
        console.log(`✅ Updated product: ${product.name}`);
        console.log(`   - Sizes: ${updates.sizes.length} options`);
        console.log(`   - Colors: ${updates.colors.length} options`);
        console.log(`   - Stock: ${updates.totalStock} units`);
        console.log(`   - Featured: ${updates.isFeatured ? 'Yes' : 'No'}`);
      }
      
      console.log('\n🎉 All products updated successfully!');
      console.log('\n📋 Updated Product Details:');
      console.log('✅ Sizes available: S, M, L, XL, XXL');
      console.log('✅ Colors available: Black, White, Navy, Gray, Red, Blue');
      console.log('✅ Stock tracking: Individual stock per size');
      console.log('✅ Product features: Featured, New Arrival, Trending');
      console.log('✅ Ratings and reviews: Randomized for demo');
      
    } catch (error) {
      console.error('❌ Error updating products:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });
