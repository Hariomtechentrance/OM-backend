import mongoose from 'mongoose';
import Collection from '../models/Collection.js';

const collections = [
  {
    name: 'Checked Collection',
    slug: 'checked-collection',
    description: 'Stylish checked patterns for modern fashion',
    order: 1,
    showInNavbar: true,
    collectionType: 'main',
    metaTitle: 'Checked Collection - Black Locust',
    metaDescription: 'Explore our premium checked collection featuring stylish patterns and modern designs.',
    tags: ['checked', 'pattern', 'modern', 'stylish']
  },
  {
    name: 'Office Collection',
    slug: 'office-collection',
    description: 'Professional attire for the modern workplace',
    order: 2,
    showInNavbar: true,
    collectionType: 'main',
    metaTitle: 'Office Collection - Professional Wear',
    metaDescription: 'Premium office wear collection for professionals. Business attire that combines style with comfort.',
    tags: ['office', 'professional', 'business', 'formal']
  },
  {
    name: 'Party Wear Collection',
    slug: 'party-wear-collection',
    description: 'Elegant outfits for special occasions',
    order: 3,
    showInNavbar: true,
    collectionType: 'main',
    metaTitle: 'Party Wear Collection - Evening Fashion',
    metaDescription: 'Stunning party wear collection for evenings and special events. Stand out with our elegant designs.',
    tags: ['party', 'evening', 'elegant', 'special']
  },
  {
    name: 'Casual Collection',
    slug: 'casual-collection',
    description: 'Comfortable everyday wear',
    order: 4,
    showInNavbar: true,
    collectionType: 'main',
    metaTitle: 'Casual Collection - Everyday Comfort',
    metaDescription: 'Comfortable and stylish casual wear for everyday use. Relax in style with our collection.',
    tags: ['casual', 'comfortable', 'everyday', 'relaxed']
  },
  {
    name: 'New Collection',
    slug: 'new-collection',
    description: 'Latest arrivals and trending styles',
    order: 5,
    showInNavbar: true,
    collectionType: 'main',
    metaTitle: 'New Collection - Latest Arrivals',
    metaDescription: 'Discover our newest collection with the latest fashion trends and fresh designs.',
    tags: ['new', 'latest', 'trending', 'fresh']
  },
  {
    name: 'Winter Collection',
    slug: 'winter-collection',
    description: 'Warm and cozy winter essentials',
    order: 6,
    showInNavbar: true,
    collectionType: 'seasonal',
    metaTitle: 'Winter Collection - Warm Essentials',
    metaDescription: 'Stay warm and stylish with our winter collection. Cozy essentials for the cold season.',
    tags: ['winter', 'warm', 'cozy', 'seasonal']
  },
  {
    name: 'Polos',
    slug: 'polos',
    description: 'Classic polo shirts for all occasions',
    order: 7,
    showInNavbar: true,
    collectionType: 'category',
    metaTitle: 'Polos Collection - Classic Shirts',
    metaDescription: 'Classic polo shirts perfect for any occasion. Timeless style meets modern comfort.',
    tags: ['polos', 'shirts', 'classic', 'versatile']
  },
  {
    name: 'Trousers',
    slug: 'trousers',
    description: 'Stylish trousers for formal and casual wear',
    order: 8,
    showInNavbar: true,
    collectionType: 'category',
    metaTitle: 'Trousers Collection - Stylish Bottoms',
    metaDescription: 'Premium trousers collection for both formal and casual occasions. Perfect fit guaranteed.',
    tags: ['trousers', 'pants', 'formal', 'casual']
  },
  {
    name: 'Denim',
    slug: 'denim',
    description: 'Quality denim jeans and jackets',
    order: 9,
    showInNavbar: true,
    collectionType: 'category',
    metaTitle: 'Denim Collection - Premium Jeans',
    metaDescription: 'High-quality denim collection featuring jeans, jackets, and more. Durable and stylish.',
    tags: ['denim', 'jeans', 'jackets', 'durable']
  },
  {
    name: 'Formal Pants',
    slug: 'formal-pants',
    description: 'Professional formal pants for business wear',
    order: 10,
    showInNavbar: true,
    collectionType: 'category',
    metaTitle: 'Formal Pants - Business Wear',
    metaDescription: 'Professional formal pants perfect for business meetings and formal events.',
    tags: ['formal', 'pants', 'business', 'professional']
  },
  {
    name: 'Summer Collection',
    slug: 'summer-collection',
    description: 'Light and breezy summer outfits',
    order: 11,
    showInNavbar: true,
    collectionType: 'seasonal',
    metaTitle: 'Summer Collection - Breezy Outfits',
    metaDescription: 'Light and comfortable summer collection. Stay cool and stylish in the heat.',
    tags: ['summer', 'light', 'breezy', 'comfortable']
  },
  {
    name: 'Printed Collection',
    slug: 'printed-collection',
    description: 'Vibrant printed designs and patterns',
    order: 12,
    showInNavbar: true,
    collectionType: 'main',
    metaTitle: 'Printed Collection - Vibrant Designs',
    metaDescription: 'Eye-catching printed collection with vibrant patterns and unique designs.',
    tags: ['printed', 'vibrant', 'patterns', 'colorful']
  },
  {
    name: 'Cargo Collection',
    slug: 'cargo-collection',
    description: 'Functional cargo pants and utility wear',
    order: 13,
    showInNavbar: true,
    collectionType: 'category',
    metaTitle: 'Cargo Collection - Utility Wear',
    metaDescription: 'Functional cargo collection with utility pockets and durable materials.',
    tags: ['cargo', 'utility', 'functional', 'pockets']
  }
];

const seedCollections = async () => {
  try {
    // Clear existing collections
    await Collection.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // Insert new collections
    const insertedCollections = await Collection.insertMany(collections);
    console.log(`✅ Seeded ${insertedCollections.length} collections`);

    // Log created collections
    insertedCollections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name} (Order: ${collection.order})`);
    });

    return insertedCollections;
  } catch (error) {
    console.error('❌ Error seeding collections:', error);
    throw error;
  }
};

export default seedCollections;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedCollections();
    })
    .then(() => {
      console.log('🎉 Collections seeded successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
