import express from "express";
import { body } from "express-validator";

import {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// ================= VALIDATION =================

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 })
];

const loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty()
];

// ================= ROUTES =================

// Auth
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/admin/login", loginValidation, adminLogin);

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin
router.get("/", protect, authorize("admin"), getAllUsers);
router.put("/:id/role", protect, authorize("admin"), updateUserRole);
router.put("/:id", protect, authorize("admin"), updateUserStatus);

// Extra
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
