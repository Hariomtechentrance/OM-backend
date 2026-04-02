const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust');
    console.log("✅ Connected to MongoDB");

    // Hash the default admin password
    const password = await bcrypt.hash("Admin@123", 10);

    // Update or create admin user
    const result = await User.updateOne(
      { email: "admin@test.com" },
      { 
        password: password,
        updatedAt: new Date()
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log("🚀 Admin user created successfully");
    } else if (result.modifiedCount > 0) {
      console.log("🔄 Admin password reset successfully");
    } else {
      console.log("ℹ️  Admin password was already up to date");
    }

    console.log("📧 Email: admin@test.com");
    console.log("🔑 Password: Admin@123");
    console.log("🔐 Role: admin");

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Disconnected from MongoDB");
    
  } catch (error) {
    console.error("❌ Error resetting admin password:", error);
    process.exit(1);
  }
};

// Run the reset
resetAdminPassword();
