import Collection from "../models/Collection.js";
import Product from "../models/Product.js";

export const getCollections = async (req, res) => {
  try {
    // Get all active collections (remove strict filtering)
    const collections = await Collection.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    // Add product count to each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const productCount = await Product.countDocuments({
          collection: collection._id,
          isActive: true
        });
        
        return {
          ...collection.toObject(),
          productCount
        };
      })
    );
    
    res.json({ success: true, collections: collectionsWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { name, slug, description, showInNavbar, isActive, collectionType, order, image } = req.body;
    
    // Create new collection
    const newCollection = new Collection({
      name,
      slug,
      description,
      showInNavbar,
      isActive,
      collectionType,
      order,
      image
    });
    
    await newCollection.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Collection created successfully',
      collection: newCollection
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
