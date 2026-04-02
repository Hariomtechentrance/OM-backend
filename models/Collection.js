import mongoose from 'mongoose';

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
  parentCollection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null
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

// Create slug from name
collectionSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

export default mongoose.model('Collection', collectionSchema);
