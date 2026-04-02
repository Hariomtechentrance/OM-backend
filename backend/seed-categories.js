import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/black-locust', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Category schema (same as your model)
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, trim: true },
  image: { type: String, required: true },
  bannerImage: { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  categoryType: { type: String, enum: ['category', 'collection'], default: 'category' },
  showInNavbar: { type: Boolean, default: true },
  showInFeatured: { type: Boolean, default: true },
  showOnHome: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  tags: [String]
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

// Auto-generate slug from name
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

// Initial categories and collections to create
const initialData = [
  // MAIN CATEGORIES
  {
    name: "Men",
    slug: "men",
    description: "Premium men's clothing and accessories",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80",
    categoryType: "category",
    order: 0,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  },
  {
    name: "Women", 
    slug: "women",
    description: "Elegant women's fashion and essentials",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    categoryType: "category",
    order: 1,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  },
  {
    name: "Kids",
    slug: "kids", 
    description: "Fun and comfortable clothing for children",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80",
    categoryType: "category",
    order: 2,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  },

  // COLLECTIONS
  {
    name: "Party Wear",
    slug: "party-wear",
    description: "Stunning outfits for special occasions and celebrations",
    image: "https://images.unsplash.com/photo-1594633312681-435c7b80c148?w=800&q=80",
    categoryType: "collection",
    order: 0,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  },
  {
    name: "Casual Wear",
    slug: "casual-wear", 
    description: "Comfortable everyday essentials",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    categoryType: "collection",
    order: 1,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  },
  {
    name: "Formal Wear",
    slug: "formal-wear",
    description: "Professional attire for business and formal events",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    categoryType: "collection", 
    order: 2,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  },
  {
    name: "Summer Collection",
    slug: "summer-collection",
    description: "Light and breezy outfits for warm weather",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    categoryType: "collection",
    order: 3,
    isActive: true,
    showInNavbar: true,
    showInFeatured: true,
    showOnHome: true
  }
];

// Seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing categories
    await Category.deleteMany({});
    console.log('🧹 Cleared existing categories');
    
    // Insert new categories and collections
    const inserted = await Category.insertMany(initialData);
    console.log(`✅ Successfully inserted ${inserted.length} categories and collections:`);
    
    inserted.forEach(item => {
      console.log(`   📁 ${item.name} (${item.type}) - ${item.slug}`);
    });
    
    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Categories created:');
    console.log('   • Men (men)');
    console.log('   • Women (women)');
    console.log('   • Kids (kids)');
    console.log('\n📋 Collections created:');
    console.log('   • Party Wear (party-wear)');
    console.log('   • Casual Wear (casual-wear)');
    console.log('   • Formal Wear (formal-wear)');
    console.log('   • Summer Collection (summer-collection)');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding
seedDatabase();
