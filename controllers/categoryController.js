import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, image, bannerImage, parentCategory, order, isActive, featured, type, showInNavbar, metaTitle, metaDescription, tags } = req.body;

    console.log('Create category request body:', req.body);

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    if (!image || image.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category image is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      description,
      image,
      bannerImage,
      parentCategory,
      order,
      isActive,
      featured,
      type: type || 'category',
      showInNavbar: showInNavbar || false,
      metaTitle,
      metaDescription,
      tags
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { featured, active, type, navbar } = req.query;
    
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (active === 'true') {
      query.isActive = true;
    }

    if (type) {
      query.type = type;
    }

    if (navbar === 'true') {
      query.showInNavbar = true;
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get products in this category
    const products = await Product.find({ 
      category: category.name,
      isActive: true 
    }).select('name price images rating numReviews');

    res.status(200).json({
      success: true,
      data: {
        category,
        products
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Skip product check for now since we're using dynamic categories
    // In the future, you might want to implement a relationship between products and categories
    // const productsCount = await Product.countDocuments({ category: category.name });
    // if (productsCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete category with existing products'
    //   });
    // }

    // Check if category has child categories
    const childCategoriesCount = await Category.countDocuments({ parentCategory: category._id });
    if (childCategoriesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with child categories'
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or already deleted'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: deletedCategory
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: error.message
    });
  }
};

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, order }

    const updatePromises = categories.map(({ id, order }) =>
      Category.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, name: 1 });

    // Build tree structure
    const buildTree = (categories, parentId = null) => {
      return categories
        .filter(cat => {
          const parent = cat.parentCategory;
          return parent ? parent._id.toString() === parentId : parentId === null;
        })
        .map(cat => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          bannerImage: cat.bannerImage,
          order: cat.order,
          featured: cat.featured,
          productCount: cat.productCount,
          children: buildTree(categories, cat._id.toString())
        }));
    };

    const tree = buildTree(categories);

    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get navbar categories
export const getNavbarCategories = async (req, res) => {
  try {
    const categories = await Category.find({ showInNavbar: true, isActive: true });
    res.json({
      success: true,
      categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get home categories
export const getHomeCategories = async (req, res) => {
  try {
    const categories = await Category.find({ showOnHome: true, isActive: true });
    res.json({
      success: true,
      categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get featured categories
export const getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ showInFeatured: true, isActive: true });
    res.json({
      success: true,
      categories
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
