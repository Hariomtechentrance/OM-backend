const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blacklocust')
  .then(() => console.log('✅ MongoDB Connected for admin creation'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Create admin user
const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@blacklocust.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@blacklocust.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create new admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@blacklocust.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n🔐 Admin Login Credentials:');
    console.log('📧 Email: admin@blacklocust.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();