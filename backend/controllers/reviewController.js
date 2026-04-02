const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Create review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Calculate average rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:productId
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's review
    const review = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update review
    review.rating = Number(rating);
    review.comment = comment;

    // Recalculate average rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:productId
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find and remove user's review
    const reviewIndex = product.reviews.findIndex(
      review => review.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    product.reviews.splice(reviewIndex, 1);
    product.numReviews = product.reviews.length;

    // Recalculate average rating
    if (product.reviews.length > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findById(productId)
      .populate('reviews.user', 'name avatar')
      .select('reviews');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const reviews = product.reviews.slice(startIndex, endIndex);

    res.json({
      reviews,
      currentPage: Number(page),
      totalPages: Math.ceil(product.reviews.length / limit),
      totalReviews: product.reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user
// @access  Private
exports.getUserReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.user': req.user._id })
      .populate('reviews.user', 'name avatar')
      .select('name images reviews');

    const userReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        if (review.user._id.toString() === req.user._id.toString()) {
          userReviews.push({
            productId: product._id,
            productName: product.name,
            productImage: product.images[0]?.url,
            review
          });
        }
      });
    });

    res.json(userReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
