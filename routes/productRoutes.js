import express from "express";
import multer from "multer";
const router = express.Router();

import {
  createProduct,
  getProductsSimple,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Debug route to test simple product fetch
router.get("/debug", async (req, res) => {
  try {
    console.log("🔍 DEBUG: Fetching products...");
    const Product = (await import("../models/Product.js")).default;
    const products = await Product.find({ isActive: true }).limit(10);
    console.log("✅ DEBUG: Products found:", products.length);
    res.json({ success: true, products, count: products.length });
  } catch (error) {
    console.log("❌ DEBUG ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Static paths must be registered before /:id
router.post("/", upload.array("images"), createProduct);
router.get("/", getProductsSimple);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
