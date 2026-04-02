const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/black-locust');

// Define Collection schema directly in script
const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showInNavbar: {
    type: Boolean,
    default: true
  },
  collectionType: {
    type: String,
    enum: ['main', 'sub', 'seasonal', 'category'],
    default: 'main'
  },
  tags: [String]
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

const Collection = mongoose.model('Collection', collectionSchema);

const defaultCollections = [
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Latest products added to our collection',
    showInNavbar: true,
    isActive: true,
    collectionType: 'main',
    order: 1,
    image: '/images/collections/new-arrivals.jpg'
  },
  {
    name: 'Featured',
    slug: 'featured',
    description: 'Handpicked premium products',
    showInNavbar: true,
    isActive: true,
    collectionType: 'main',
    order: 2,
    image: '/images/collections/featured.jpg'
  },
  {
    name: 'Summer Collection',
    slug: 'summer-collection',
    description: 'Perfect outfits for summer season',
    showInNavbar: true,
    isActive: true,
    collectionType: 'seasonal',
    order: 3,
    image: '/images/collections/summer.jpg'
  },
  {
    name: 'Winter Collection',
    slug: 'winter-collection',
    description: 'Warm and cozy winter wear',
    showInNavbar: true,
    isActive: true,
    collectionType: 'seasonal',
    order: 4,
    image: '/images/collections/winter.jpg'
  },
  {
    name: 'Kids Collection',
    slug: 'kids-collection',
    description: 'Fun and comfortable clothes for kids',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 5,
    image: '/images/collections/kids.jpg'
  },
  {
    name: 'Men\'s Collection',
    slug: 'mens-collection',
    description: 'Stylish outfits for men',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 6,
    image: '/images/collections/mens.jpg'
  },
  {
    name: 'Women\'s Collection',
    slug: 'womens-collection',
    description: 'Elegant and trendy women\'s wear',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 7,
    image: '/images/collections/womens.jpg'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion accessories and essentials',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 8,
    image: '/images/collections/accessories.jpg'
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Footwear for all occasions',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 9,
    image: '/images/collections/shoes.jpg'
  },
  {
    name: 'Bags',
    slug: 'bags',
    description: 'Handbags and travel bags',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 10,
    image: '/images/collections/bags.jpg'
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Fine jewelry and fashion accessories',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 11,
    image: '/images/collections/jewelry.jpg'
  },
  {
    name: 'Watches',
    slug: 'watches',
    description: 'Luxury and casual timepieces',
    showInNavbar: true,
    isActive: true,
    collectionType: 'category',
    order: 12,
    image: '/images/collections/watches.jpg'
  },
  {
    name: 'Sale',
    slug: 'sale',
    description: 'Discounted items and special offers',
    showInNavbar: true,
    isActive: true,
    collectionType: 'main',
    order: 13,
    image: '/images/collections/sale.jpg'
  },
  {
    name: 'Clearance',
    slug: 'clearance',
    description: 'Final clearance items',
    showInNavbar: true,
    isActive: true,
    collectionType: 'main',
    order: 14,
    image: '/images/collections/clearance.jpg'
  }
];

async function addDefaultCollections() {
  try {
    // Clear existing collections
    await Collection.deleteMany({});
    console.log('Cleared existing collections');

    // Add default collections
    const insertedCollections = await Collection.insertMany(defaultCollections);
    console.log(`Added ${insertedCollections.length} default collections:`);
    
    insertedCollections.forEach(collection => {
      console.log(`- ${collection.name} (${collection.slug})`);
    });

    console.log('\n✅ Default collections added successfully!');
  } catch (error) {
    console.error('❌ Error adding collections:', error);
  } finally {
    mongoose.connection.close();
  }
}

addDefaultCollections();
