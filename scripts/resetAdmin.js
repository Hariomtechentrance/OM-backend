const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust');
    console.log("✅ Connected to MongoDB");

    // Hash the default admin password
    const password = await bcrypt.hash("Admin@123", 10);

    // Update super admin password
    const result = await User.updateOne(
      { email: "superadmin@blacklocust.com" },
      { 
        password: password,
        updatedAt: new Date()
      }
    );

    if (result.modifiedCount > 0) {
      console.log("🔄 Super admin password reset successfully");
      console.log("📧 Email: superadmin@blacklocust.com");
      console.log("🔑 New Password: Admin@123");
    } else {
      console.log("ℹ️  Super admin password was already up to date");
    }

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Disconnected from MongoDB");
    
  } catch (error) {
    console.error("❌ Error resetting admin password:", error);
    process.exit(1);
  }
};

resetAdminPassword();
