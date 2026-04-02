import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: [true, 'Product collection is required']
  },
  skuCode: {
    type: String,
    required: [true, 'SKU code is required'],
    unique: true,
    trim: true
  },
  h1Heading: {
    type: String,
    required: [true, 'H1 heading is required'],
    trim: true
  },
  // Enhanced product specifications for detailed display
  productSpecs: {
    fit: {
      type: String,
      enum: ['Regular Fit', 'Tailored Fit', 'Slim Fit', 'Relaxed Fit'],
      default: 'Regular Fit'
    },
    availableSizes: [{
      size: String,
      stock: {
        type: Number,
        default: 0
      }
    }],
    marketingDescription: {
      type: String,
      required: true
    },
    technicalSpecs: {
      fabric: String,
      sleeves: String,
      collar: String,
      pocket: String,
      occasion: String
    }
  },
  specifications: {
    type: String,
    required: [true, 'Product specifications are required']
  },
  productLink: {
    type: String,
    trim: true
  },
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'limited'],
    default: 'in_stock'
  },
  brand: {
    type: String,
    trim: true,
    default: 'Black Locust'
  },
  images: [
    {
      url: String,
      public_id: String,
    }
  ],
  sizes: [
    {
      size: String,
      stock: Number,
    },
  ],
  colors: [String],
  totalStock: Number,
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [String],
  material: String,
  careInstructions: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate average rating
productSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.rating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
  }
};

export default mongoose.model('Product', productSchema);
