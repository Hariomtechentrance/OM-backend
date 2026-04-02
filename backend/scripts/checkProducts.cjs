const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blacklocust');

// Define Product schema
const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  images: [String],
  category: mongoose.Schema.Types.ObjectId,
  collection: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  featured: Boolean,
  order: Number,
  tags: [String]
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
  try {
    console.log('🔥 CHECKING ACTUAL DATABASE PRODUCTS...');
    
    const products = await Product.find({}).sort({order: 1});
    
    console.log(`\n📦 FOUND ${products.length} PRODUCTS:\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug})`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Active: ${product.isActive}`);
      console.log(`   Featured: ${product.featured}`);
      console.log(`   Images: ${product.images ? product.images.length : 0}`);
      console.log(`   Order: ${product.order}`);
      console.log(`---`);
    });
    
    // Check active products
    const activeProducts = products.filter(prod => prod.isActive);
    console.log(`\n✅ ACTIVE PRODUCTS (${activeProducts.length}):`);
    activeProducts.forEach((prod, index) => {
      console.log(`${index + 1}. ${prod.name} - $${prod.price}`);
    });
    
    // Check featured products
    const featuredProducts = products.filter(prod => prod.featured && prod.isActive);
    console.log(`\n⭐ FEATURED PRODUCTS (${featuredProducts.length}):`);
    featuredProducts.forEach((prod, index) => {
      console.log(`${index + 1}. ${prod.name} - $${prod.price}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkProducts();
