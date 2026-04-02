const mongoose = require('mongoose');
const Category = require('./models/Category');

// Sample categories data - Only Men's and Kids' as requested
const sampleCategories = [
  {
    name: "Men's Collection",
    slug: "mens-collection",
    description: "Refined elegance meets contemporary style",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1594634319159-ec19e1c396f1?w=1200&q=80",
    order: 0,
    isActive: true,
    featured: true,
    type: "category",
    showInNavbar: true,
    metaTitle: "Men's Fashion Collection - Black Locust",
    metaDescription: "Discover our premium men's collection featuring stylish shirts, pants, jackets and more.",
    tags: ["men", "fashion", "premium", "style"]
  },
  {
    name: "Kids Collection",
    slug: "kids-collection",
    description: "Adventure-ready style for young minds",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=1200&q=80",
    order: 1,
    isActive: true,
    featured: true,
    type: "category",
    showInNavbar: true,
    metaTitle: "Kids Fashion Collection - Black Locust",
    metaDescription: "Fun and comfortable clothing for kids, designed for adventure and play.",
    tags: ["kids", "children", "play", "comfortable"]
  }
];

// Sample collections data - These will appear in navbar dropdown
const sampleCollections = [
  {
    name: "Party Wear",
    slug: "party-wear",
    description: "Stylish outfits for special occasions",
    image: "https://images.unsplash.com/photo-1594634319159-ec19e1c396f1?w=800&q=80",
    order: 0,
    isActive: true,
    type: "collection",
    showInNavbar: true,
    metaTitle: "Party Wear Collection - Black Locust",
    metaDescription: "Elegant party wear for all your special occasions.",
    tags: ["party", "formal", "special", "occasions"]
  },
  {
    name: "Casual",
    slug: "casual",
    description: "Comfortable everyday wear",
    image: "https://images.unsplash.com/photo-151676268803-be716536a3f1?w=800&q=80",
    order: 1,
    isActive: true,
    type: "collection",
    showInNavbar: true,
    metaTitle: "Casual Wear Collection - Black Locust",
    metaDescription: "Comfortable and stylish casual wear for everyday comfort.",
    tags: ["casual", "comfortable", "everyday", "relaxed"]
  },
  {
    name: "Polo T-shirts",
    slug: "polo-tshirts",
    description: "Classic polo shirts for men",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    order: 2,
    isActive: true,
    type: "collection",
    showInNavbar: true,
    metaTitle: "Polo T-shirts Collection - Black Locust",
    metaDescription: "Premium polo t-shirts for men.",
    tags: ["polo", "tshirts", "men", "classic"]
  },
  {
    name: "New Collection",
    slug: "new-collection",
    description: "Latest arrivals and trends",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    order: 3,
    isActive: true,
    type: "collection",
    showInNavbar: true,
    metaTitle: "New Collection - Black Locust",
    metaDescription: "Check out our latest arrivals and trending styles.",
    tags: ["new", "latest", "trending", "arrivals"]
  },
  {
    name: "All Products",
    slug: "all-products",
    description: "Browse all our products",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    order: 4,
    isActive: true,
    type: "collection",
    showInNavbar: true,
    metaTitle: "All Products - Black Locust",
    metaDescription: "Browse our complete collection of premium fashion products.",
    tags: ["all", "products", "complete", "browse"]
  }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust');
    
    console.log('Connected to MongoDB');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');
    
    // Create main categories
    const createdCategories = await Category.create(sampleCategories);
    console.log(`Created ${createdCategories.length} main categories`);
    
    // Create collections
    const createdCollections = await Category.create(sampleCollections);
    console.log(`Created ${createdCollections.length} collections`);
    
    console.log('Categories and Collections seeded successfully!');
    
    // Display created categories and collections
    const allCategories = await Category.find().populate('parentCategory', 'name');
    console.log('\n=== Created Categories ===');
    allCategories.forEach(cat => {
      const parent = cat.parentCategory ? ` (Parent: ${cat.parentCategory.name})` : '';
      const status = cat.isActive ? 'Active' : 'Inactive';
      const featured = cat.featured ? 'Featured' : '';
      const navbar = cat.showInNavbar ? 'Navbar' : '';
      const type = cat.type === 'category' ? 'Category' : 'Collection';
      console.log(`- ${cat.name} (${type})${parent} - ${status} ${featured} ${navbar}`);
    });
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
