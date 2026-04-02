const mongoose = require('mongoose');
const Collection = require('../models/Collection.js');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/black-locust');

const defaultCollections = [
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Latest products added to our collection',
    showInNavbar: true,
    isActive: true,
    collectionType: 'featured',
    order: 1,
    image: '/images/collections/new-arrivals.jpg'
  },
  {
    name: 'Featured Collection',
    slug: 'featured-collection',
    description: 'Handpicked premium products',
    showInNavbar: true,
    isActive: true,
    collectionType: 'featured',
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
