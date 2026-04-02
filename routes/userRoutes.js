import express from "express";
import { body } from "express-validator";
import User from "../models/userModel.js";

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
  resetPassword,
  refreshAccessToken
} from "../controllers/userController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Validation
const registerValidation = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
];

const loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty()
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/refresh-token", refreshAccessToken);
router.post("/admin/login", loginValidation, adminLogin);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/test-users", async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.json({
      success: true,
      message: 'User role updated to admin',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", protect, authorize("admin"), getAllUsers);
router.put("/:id/role", protect, authorize("admin"), updateUserRole);
router.put("/:id", protect, authorize("admin"), updateUserStatus);

router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;