import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
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
    required: [true, 'Category image is required']
  },
  bannerImage: {
    type: String
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  categoryType: {
    type: String,
    enum: ['category', 'collection'],
    default: 'category'
  },
  showInNavbar: {
    type: Boolean,
    default: false
  },
  showInFeatured: {
    type: Boolean,
    default: false
  },
  showOnHome: {
    type: Boolean,
    default: false
  },
  productCount: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String
  },
  metaDescription: {
    type: String
  },
  tags: [String]
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

// Create slug from name
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model('Category', categorySchema);
