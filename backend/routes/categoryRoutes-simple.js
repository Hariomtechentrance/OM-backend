import express from 'express';

const router = express.Router();

// Simple categories endpoint for now
router.get("/", async (req, res) => {
  try {
    console.log("🔥 GET CATEGORIES API HIT");
    
    // Return mock categories for now
    const categories = [
      { _id: "cat1", name: "Shirts", type: "category", isFeatured: true },
      { _id: "cat2", name: "Pants", type: "category", isFeatured: true },
      { _id: "cat3", name: "Dresses", type: "category", isFeatured: false },
      { _id: "cat4", name: "Accessories", type: "category", isFeatured: false }
    ];
    
    const { feature, type } = req.query;
    let filteredCategories = categories;
    
    if (feature === 'true') {
      filteredCategories = categories.filter(cat => cat.isFeatured);
    }
    
    if (type === 'category') {
      filteredCategories = filteredCategories.filter(cat => cat.type === 'category');
    }
    
    res.json({
      success: true,
      categories: filteredCategories
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});

export default router;
