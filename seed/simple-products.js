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
    // Get collections and categories
    const collections = await Collection.find({}).lean();
    const categories = await Category.find({}).lean();
    
    console.log('📊 Found collections:', collections.length);
    console.log('📊 Found categories:', categories.length);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create products with required fields
    const productsToInsert = sampleProducts.map((product, index) => {
      // Use first available collection and category, or create dummy ones if needed
      const collectionId = collections.length > 0 ? collections[0]._id : new mongoose.Types.ObjectId();
      const categoryId = categories.length > 0 ? categories[0]._id : new mongoose.Types.ObjectId();
      
      return {
        ...product,
        category: categoryId,
        collection: collectionId
      };
    });

    // Insert products
    const insertedProducts = await Product.insertMany(productsToInsert);
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
