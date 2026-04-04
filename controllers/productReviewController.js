import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/userModel.js';
import StoreOrder from '../models/StoreOrder.js';

function mapReviewForClient(review) {
  const o = review.toObject ? review.toObject() : { ...review };
  const voters = o.helpfulVoters || [];
  o.helpfulCount = voters.length;
  delete o.helpfulVoters;
  return o;
}

/**
 * GET /api/products/:id/reviews
 * Public — paginated reviews + summary for PDP
 */
export async function getProductReviews(req, res) {
  try {
    const { id } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const product = await Product.findById(id)
      .select('reviews rating numReviews')
      .lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const all = [...(product.reviews || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const total = all.length;
    const fiveStarCount = all.filter((r) => Number(r.rating) === 5).length;
    const start = (page - 1) * limit;
    const slice = all.slice(start, start + limit).map((r) => {
      const voters = r.helpfulVoters || [];
      const { helpfulVoters, ...rest } = r;
      return { ...rest, helpfulCount: voters.length };
    });

    res.json({
      success: true,
      reviews: slice,
      summary: {
        averageRating: product.rating ?? 0,
        numReviews: product.numReviews ?? total,
        fiveStarCount,
        totalReviews: total
      },
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      totalReviews: total
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

/**
 * POST /api/products/:id/reviews
 * Auth — one review per user per product
 */
export async function createProductReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const text = typeof comment === 'string' ? comment.trim() : '';
    if (text.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review must be at least 10 characters'
      });
    }
    if (text.length > 2000) {
      return res.status(400).json({ success: false, message: 'Review is too long' });
    }

    let imageUrls = [];
    if (Array.isArray(images)) {
      imageUrls = images
        .filter((u) => typeof u === 'string' && u.trim())
        .map((u) => u.trim())
        .slice(0, 6);
    } else if (typeof images === 'string' && images.trim()) {
      imageUrls = [images.trim()];
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const uid = req.user._id;
    const already = product.reviews?.some(
      (rev) => rev.user && rev.user.toString() === uid.toString()
    );
    if (already) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const user = await User.findById(uid).select('name');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const verifiedPurchase = !!(await StoreOrder.exists({
      user: uid,
      'items.product': id,
      status: { $nin: ['cancelled'] }
    }));

    product.reviews.push({
      user: uid,
      name: user.name,
      rating: r,
      comment: text,
      images: imageUrls,
      verifiedPurchase,
      helpfulVoters: []
    });

    product.calculateRating();
    await product.save();

    const added = product.reviews[product.reviews.length - 1];
    res.status(201).json({
      success: true,
      message: 'Thank you for your review',
      review: mapReviewForClient(added)
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

/**
 * POST /api/products/:id/reviews/:reviewId/helpful
 * Auth — one helpful vote per user per review
 */
export async function markReviewHelpful(req, res) {
  try {
    const { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const uid = req.user._id;
    const voters = review.helpfulVoters || [];
    if (voters.some((v) => v.toString() === uid.toString())) {
      return res.status(400).json({ success: false, message: 'You already marked this helpful' });
    }

    review.helpfulVoters.push(uid);
    await product.save();

    res.json({
      success: true,
      helpfulCount: review.helpfulVoters.length
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
