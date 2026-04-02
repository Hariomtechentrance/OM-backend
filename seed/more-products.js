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
  },
  {
    name: 'Navy Blue Polo',
    price: 999,
    description: 'Comfortable navy blue polo shirt for casual wear',
    images: [{ url: 'https://images.unsplash.com/photo-1596755066917-39f4b7b7e4b?w=400&q=80', public_id: 'product2' }],
    brand: 'Black Locust',
    skuCode: 'BLS-POL-002',
    h1Heading: 'Navy Blue Polo',
    tags: ['polo', 'navy', 'casual', 'blue'],
    material: 'Cotton Blend',
    careInstructions: 'Machine wash cold, tumble dry low',
    totalStock: 150,
    isFeatured: true,
    isNewArrival: false,
    isTrending: true,
    rating: 4.2,
    numReviews: 8,
    isActive: true,
    specifications: 'Cotton Blend, Regular Fit, Machine Washable',
    productSpecs: {
      marketingDescription: 'Comfortable navy blue polo shirt for casual wear'
    }
  },
  {
    name: 'Kids Casual T-Shirt',
    price: 599,
    description: 'Colorful and comfortable t-shirt for kids',
    images: [{ url: 'https://images.unsplash.com/photo-1523381217965-fa30a36e6a9c?w=400&q=80', public_id: 'product3' }],
    brand: 'Black Locust',
    skuCode: 'BLK-KID-003',
    h1Heading: 'Kids Casual T-Shirt',
    tags: ['kids', 'casual', 't-shirt', 'colorful'],
    material: 'Soft Cotton',
    careInstructions: 'Machine wash cold, tumble dry low',
    totalStock: 80,
    isFeatured: false,
    isNewArrival: true,
    isTrending: false,
    rating: 4.8,
    numReviews: 6,
    isActive: true,
    specifications: 'Soft Cotton, Kids Fit, Machine Washable',
    productSpecs: {
      marketingDescription: 'Colorful and comfortable t-shirt for kids'
    }
  },
  {
    name: 'Formal Black Pants',
    price: 1599,
    description: 'Professional black pants for formal occasions',
    images: [{ url: 'https://images.unsplash.com/photo-1594634312680-0be55f8a4f2b?w=400&q=80', public_id: 'product4' }],
    brand: 'Black Locust',
    skuCode: 'BLS-FML-004',
    h1Heading: 'Formal Black Pants',
    tags: ['formal', 'pants', 'black', 'professional'],
    material: 'Premium Wool Blend',
    careInstructions: 'Dry clean only',
    totalStock: 60,
    isFeatured: true,
    isNewArrival: false,
    isTrending: false,
    rating: 4.6,
    numReviews: 10,
    isActive: true,
    specifications: 'Premium Wool Blend, Slim Fit, Dry Clean Only',
    productSpecs: {
      marketingDescription: 'Professional black pants for formal occasions'
    }
  },
  {
    name: 'Summer Dress',
    price: 899,
    description: 'Light and breezy summer dress for kids',
    images: [{ url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', public_id: 'product5' }],
    brand: 'Black Locust',
    skuCode: 'BLK-KID-005',
    h1Heading: 'Summer Dress',
    tags: ['summer', 'dress', 'kids', 'lightweight'],
    material: 'Lightweight Cotton',
    careInstructions: 'Machine wash cold, tumble dry low',
    totalStock: 40,
    isFeatured: false,
    isNewArrival: true,
    isTrending: false,
    rating: 4.7,
    numReviews: 4,
    isActive: true,
    specifications: 'Lightweight Cotton, A-Line Fit, Machine Washable',
    productSpecs: {
      marketingDescription: 'Light and breezy summer dress for kids'
    }
  },
  {
    name: 'Winter Jacket',
    price: 2499,
    description: 'Warm and stylish winter jacket',
    images: [{ url: 'https://images.unsplash.com/photo-1544968349-85a8c4c6b706?w=400&q=80', public_id: 'product6' }],
    brand: 'Black Locust',
    skuCode: 'BLS-WTR-006',
    h1Heading: 'Winter Jacket',
    tags: ['winter', 'jacket', 'warm', 'stylish'],
    material: 'Wool Blend',
    careInstructions: 'Dry clean recommended',
    totalStock: 50,
    isFeatured: true,
    isNewArrival: false,
    isTrending: true,
    rating: 4.9,
    numReviews: 15,
    isActive: true,
    specifications: 'Wool Blend, Regular Fit, Dry Clean Recommended',
    productSpecs: {
      marketingDescription: 'Warm and stylish winter jacket'
    }
  },
  {
    name: 'Casual Jeans',
    price: 1199,
    description: 'Comfortable denim jeans for everyday wear',
    images: [{ url: 'https://images.unsplash.com/photo-1542272608-5c9ae14e76c3?w=400&q=80', public_id: 'product7' }],
    brand: 'Black Locust',
    skuCode: 'BLS-JNS-007',
    h1Heading: 'Casual Jeans',
    tags: ['casual', 'jeans', 'denim', 'comfortable'],
    material: 'Premium Denim',
    careInstructions: 'Machine wash cold, inside out',
    totalStock: 120,
    isFeatured: false,
    isNewArrival: true,
    isTrending: false,
    rating: 4.4,
    numReviews: 20,
    isActive: true,
    specifications: 'Premium Denim, Regular Fit, Machine Washable',
    productSpecs: {
      marketingDescription: 'Comfortable denim jeans for everyday wear'
    }
  },
  {
    name: 'Kids Party Wear',
    price: 1299,
    description: 'Elegant party outfit for special occasions',
    images: [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b014d7?w=400&q=80', public_id: 'product8' }],
    brand: 'Black Locust',
    skuCode: 'BLK-KID-008',
    h1Heading: 'Kids Party Wear',
    tags: ['party', 'kids', 'formal', 'elegant'],
    material: 'Silk Blend',
    careInstructions: 'Dry clean only',
    totalStock: 30,
    isFeatured: true,
    isNewArrival: true,
    isTrending: false,
    rating: 4.8,
    numReviews: 8,
    isActive: true,
    specifications: 'Silk Blend, Formal Fit, Dry Clean Only',
    productSpecs: {
      marketingDescription: 'Elegant party outfit for special occasions'
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
      // Use first available collection and category
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
