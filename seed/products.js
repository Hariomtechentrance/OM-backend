import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Collection from '../models/Collection.js';
import Category from '../models/Category.js';

const sampleProducts = [
  {
    name: 'Classic White Shirt',
    price: 1299,
    description: 'Premium cotton white shirt perfect for any occasion',
    images: [{ url: 'https://images.unsplash.com/photo-1596755066917-39f4b7b7e4b?w=400&q=80', public_id: 'product1' }],
    category: null,
    collection: null,
    brand: 'Black Locust',
    skuCode: 'BLS-WHT-001',
    h1Heading: 'Classic White Shirt',
    tags: ['classic', 'formal', 'white', 'shirt'],
    material: 'Premium Cotton',
    careInstructions: 'Machine wash cold, tumble dry low',
    totalStock: 100,
    isFeatured: true,
    isNewArrival: true,
    isTrending: false,
    rating: 4.5,
    numReviews: 12,
    isActive: true,
    specifications: '100% Cotton, Regular Fit, Machine Washable',
    productSpecs: {
      marketingDescription: 'Premium cotton white shirt perfect for any occasion'
    }
  }
];

const seedProducts = async () => {
  try {
    const collections = await Collection.find({}).lean();
    const categories = await Category.find({}).lean();
    
    console.log('📊 Found collections:', collections.length);
    console.log('📊 Found categories:', categories.length);
    console.log('� First category:', categories[0]);
    
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create a simple product with the first available collection
    const firstCollection = collections[0];
    const firstCategory = categories[0];
    
    console.log('📊 Using collection:', firstCollection?.name || 'None');
    console.log('📊 Using category:', firstCategory?.name || 'None');
    
    const simpleProduct = {
      ...sampleProducts[0],
      category: firstCategory?._id, // Use first category
      collection: firstCollection?._id // Use first collection
    };

    const insertedProducts = await Product.insertMany([simpleProduct]);
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    return insertedProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

export default seedProducts;

if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blacklocust')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedProducts();
    })
    .then(() => {
      console.log('🎉 Products seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
