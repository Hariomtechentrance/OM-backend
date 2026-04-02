const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { validateOrder, generateSecureToken } = require('../middleware/security');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Advanced product search with multiple filters
router.get('/search', async (req, res) => {
  try {
    const {
      query,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      material,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
      inStock = true
    } = req.query;

    // Build search query
    const searchQuery = {};
    
    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Category filters
    if (category && category !== 'all') {
      searchQuery.category = category;
    }
    
    if (subcategory) {
      searchQuery.subcategory = subcategory;
    }

    if (brand) {
      searchQuery.brand = { $regex: brand, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }

    // Size filter
    if (size) {
      searchQuery['sizes.name'] = size;
    }

    // Color filter
    if (color) {
      searchQuery.colors = color;
    }

    // Material filter
    if (material) {
      searchQuery['specifications.material'] = material;
    }

    // Stock filter
    if (inStock === 'true') {
      searchQuery['sizes.stock'] = { $gt: 0 };
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'name-desc':
        sortOptions = { name: -1 };
        break;
      case 'popularity':
        sortOptions = { soldCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 }; // Default sort
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute search with aggregation for better performance
    const pipeline = [
      { $match: searchQuery }
    ];

    // Add relevance scoring only if there's a text query
    if (query) {
      pipeline.push({
        $addFields: {
          relevance: {
            $cond: {
              if: { $regexMatch: { input: '$name', regex: query, options: 'i' } },
              then: 10,
              else: {
                $cond: {
                  if: { $regexMatch: { input: '$description', regex: query, options: 'i' } },
                  then: 5,
                  else: {
                    $cond: {
                      if: { $regexMatch: { input: '$brand', regex: query, options: 'i' } },
                      then: 3,
                      else: 1
                    }
                  }
                }
              }
            }
          }
        }
      });
      sortOptions = { relevance: -1, ...sortOptions };
    }

    // Add sorting
    pipeline.push({ $sort: sortOptions });

    // Add pagination and facet
    pipeline.push({
      $facet: {
        products: [{ $skip: skip }, { $limit: limitNum }],
        totalCount: [{ $count: 'total' }]
      }
    });

    const products = await Product.aggregate(pipeline);

    res.json({
      success: true,
      products: products.products || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: products.totalCount?.[0]?.total || 0,
        pages: Math.ceil((products.totalCount?.[0]?.total || 0) / limitNum)
      },
      filters: {
        query,
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        size,
        color,
        material,
        sortBy
      }
    });

  } catch (error) {
    console.error('Product search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search products',
      message: error.message 
    });
  }
});

// Get product categories with counts
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      categories: categories.map(cat => ({
        name: cat._id,
        productCount: cat.count,
        avgPrice: Math.round(cat.avgPrice),
        minPrice: cat.minPrice,
        maxPrice: cat.maxPrice
      }))
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get product details with enhanced information
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate('reviews.userId', 'name avatar')
      .lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate product statistics
    const totalReviews = product.reviews?.length || 0;
    const avgRating = totalReviews > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Get available sizes with stock
    const availableSizes = product.sizes?.filter(size => size.stock > 0) || [];

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      $or: [
        { category: product.category },
        { subcategory: product.subcategory },
        { brand: product.brand }
      ]
    })
    .limit(10)
    .select('name price images rating soldCount')
    .lean();

    // Product view tracking
    console.log(`Product viewed: ${product.name} by user: ${req.user?.userId || 'anonymous'}`);

    res.json({
      product: {
        ...product,
        statistics: {
          totalReviews,
          avgRating: Math.round(avgRating * 10) / 10,
          viewCount: product.viewCount || 0,
          soldCount: product.soldCount || 0,
          wishlistedCount: product.wishlistedCount || 0
        },
        availability: {
          inStock: availableSizes.length > 0,
          totalStock: availableSizes.reduce((sum, size) => sum + size.stock, 0),
          sizes: availableSizes
        },
        relatedProducts: relatedProducts.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          rating: product.rating,
          soldCount: product.soldCount
        }))
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product review
router.post('/:id/reviews', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { id } = req.params;
      const { rating, title, comment, images } = req.body;
      const userId = req.user.userId;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ 
          error: 'Rating must be between 1 and 5' 
        });
      }

      if (!title || title.trim().length < 10) {
        return res.status(400).json({ 
          error: 'Review title must be at least 10 characters' 
        });
      }

      // Check if user already reviewed
      const product = await Product.findById(id).session(session);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const existingReview = product.reviews?.find(
        review => review.userId.toString() === userId
      );

      if (existingReview) {
        return res.status(400).json({ 
          error: 'You have already reviewed this product' 
        });
      }

      // Add review
      const review = {
        userId,
        rating: parseFloat(rating),
        title: title.trim(),
        comment: comment?.trim() || '',
        images: images || [],
        verified: true, // Auto-verify for now
        helpful: 0,
        createdAt: new Date()
      };

      product.reviews.push(review);
      
      // Update product rating
      const totalReviews = product.reviews.length;
      const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
      product.rating = Math.round(avgRating * 10) / 10;
      product.reviewCount = totalReviews;

      await product.save({ session });

      res.status(201).json({
        message: 'Review added successfully',
        review: {
          id: review._id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          createdAt: review.createdAt
        }
      });
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  } finally {
    session.endSession();
  }
});

// Get product reviews with pagination
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sortBy = 'newest' } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const product = await Product.findById(id)
      .populate('reviews.userId', 'name avatar')
      .lean();

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Sort reviews
    let sortOptions = {};
    switch (sortBy) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'rating-high':
        sortOptions = { rating: -1 };
        break;
      case 'rating-low':
        sortOptions = { rating: 1 };
        break;
      case 'helpful':
        sortOptions = { helpful: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Paginate reviews
    const reviews = product.reviews || [];
    const totalReviews = reviews.length;
    const paginatedReviews = reviews
      .sort((a, b) => {
        if (sortOptions.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      })
      .skip(skip)
      .limit(limitNum);

    res.json({
      reviews: paginatedReviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limitNum)
      },
      productInfo: {
        id: product._id,
        name: product.name,
        avgRating: product.rating,
        totalReviews: totalReviews
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Add to wishlist
router.post('/:id/wishlist', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add to user's wishlist
    await User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: id }
    });

    // Update product wishlist count
    product.wishlistedCount = (product.wishlistedCount || 0) + 1;
    await product.save();

    res.json({
      message: 'Product added to wishlist',
      inWishlist: true
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:id/wishlist', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove from user's wishlist
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: id }
    });

    // Update product wishlist count
    product.wishlistedCount = Math.max((product.wishlistedCount || 0) - 1, 0);
    await product.save();

    res.json({
      message: 'Product removed from wishlist',
      inWishlist: false
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

// Get product analytics (admin only)
router.get('/analytics/summary', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const analytics = await Product.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: '$price' },
          avgPrice: { $avg: '$price' },
          categories: { $addToSet: '$category' },
          brands: { $addToSet: '$brand' },
          lowStock: {
            $sum: {
              $cond: {
                if: { $lte: ['$sizes.stock', 10] },
                then: 1,
                else: 0
              }
            }
          }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      summary: analytics[0] || {
        totalProducts: 0,
        totalValue: 0,
        avgPrice: 0,
        categories: [],
        brands: [],
        lowStock: 0
      },
      categoryBreakdown: analytics.slice(1).map(cat => ({
        category: cat._id,
        count: cat.count,
        avgPrice: Math.round(cat.avgPrice),
        minPrice: cat.minPrice,
        maxPrice: cat.maxPrice
      }))
    });

  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Create new product (admin only)
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const productData = req.body;
    
    // Generate product SKU
    const sku = `BL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    productData.sku = sku;
    
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
