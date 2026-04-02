import Collection from "../models/Collection.js";

export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
