const mongoose = require('mongoose');

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
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'T-Shirts', 'Shirts', 'Pants', 'Jeans', 'Jackets', 'Sweaters', 
      'Accessories', 'Shoes', 'Party Wear', 'Casual', 'Polo T-shirts', 
      'New Collection', 'Striped Collections', 'Cargo Collection', 
      'Trousers Collection', 'Denim Collection', 'Winter Collections', 
      'Formal Pants', 'Summer Final', 'Office Collections', 
      'Checked Collections', 'all'
    ]
  },
  brand: {
    type: String,
    trim: true,
    default: 'Black Locust'
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String
  }],
  sizes: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['standard', 'numeric', 'plus', 'kids'],
      default: 'standard'
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    price: {
      type: Number,
      min: 0
    }
  }],
  colors: [String], // Simplified to just string array
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Product', productSchema);
