import express from "express";

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
} from "../controllers/userController-working.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Admin routes
router.get("/", getAllUsers);
router.put("/:id/role", updateUserRole);
router.put("/:id", updateUserStatus);

// Extra routes
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
