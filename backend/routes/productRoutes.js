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

// Static paths must be registered before /:id
router.post("/", upload.array("images"), createProduct);
router.get("/", getProductsSimple);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
