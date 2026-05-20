import express from "express";
import multer from "multer";
const router = express.Router();

import {
  createProduct,
  getProductsSimple,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  syncAllProductsDiscountInherit,
  bulkUploadProducts
} from "../controllers/productController.js";
import {
  getProductReviews,
  createProductReview,
  markReviewHelpful
} from "../controllers/productReviewController.js";
import { protect, authorize } from "../middleware/auth.js";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Static paths must be registered before /:id
router.post("/admin/bulk-upload", upload.single("csvFile"), bulkUploadProducts);
router.post("/", upload.array("images"), createProduct);
router.post(
  "/admin/sync-discount-inherit",
  protect,
  authorize("admin", "super admin"),
  syncAllProductsDiscountInherit
);
router.get("/", getProductsSimple);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createProductReview);
router.post("/:id/reviews/:reviewId/helpful", protect, markReviewHelpful);
router.put("/:id/toggle-status", toggleProductStatus);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
