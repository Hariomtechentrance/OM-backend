import express from "express";
import {
  addToCart,
  getCart,
  updateCartLine,
  removeCartLine,
  clearCart,
  getCartSummary,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/line", protect, updateCartLine);
router.delete("/line", protect, removeCartLine);
router.delete("/", protect, clearCart);
router.get("/summary", protect, getCartSummary);

export default router;
