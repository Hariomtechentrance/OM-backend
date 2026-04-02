import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Create user endpoint (for testing)
router.post("/register", async (req, res) => {
  try {
    console.log("🔥 REGISTER API HIT");
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    console.log("✅ User created:", email);
    console.log("🔍 User object after creation:", JSON.stringify(user, null, 2));
    console.log("🔍 User password field:", user.password);
    console.log("🔍 User password type:", typeof user.password);

    res.json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 LOGIN API HIT");
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Check if user has password
    if (!user.password) {
      console.log("❌ User password is undefined for:", email);
      return res.status(401).json({ success: false, message: "Invalid user data - no password set" });
    }

    console.log("🔍 User found:", email);
    console.log("🔍 Password type:", typeof user.password);
    console.log("🔍 Password exists:", !!user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    console.log("✅ Login successful for:", email);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin login route
router.post("/admin/login", async (req, res) => {
  try {
    console.log("🔥 ADMIN LOGIN API HIT");
    const { email, password } = req.body;

    // Fixed admin credentials
    if (email !== "admin@blacklocust.com" || password !== "admin123") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    console.log("✅ Admin login successful");

    res.json({
      success: true,
      admin: {
        email,
        role: "admin",
        name: "Admin User"
      },
      token: "admin-token-" + Date.now() // Simple token for admin
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;
