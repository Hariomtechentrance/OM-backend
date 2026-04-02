const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createNewAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/black-locust');
    console.log('Connected to MongoDB');

    // New admin user data
    const newAdmin = {
      name: 'New Admin User',
      email: 'newadmin@blacklocust.com',
      password: 'NewAdmin@123456',
      role: 'admin',
      phone: '+1234567899',
      isActive: true,
      isEmailVerified: true,
      loginAttempts: 0,
      accountLocked: false
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: newAdmin.email });
    
    if (existingUser) {
      console.log(`❌ User ${newAdmin.email} already exists. Deleting and recreating...`);
      await User.deleteOne({ email: newAdmin.email });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(newAdmin.password, 12);
    
    // Create user using insertOne to bypass pre-save hook
    const result = await User.insertOne({
      name: newAdmin.name,
      email: newAdmin.email,
      password: hashedPassword,  // Already hashed
      role: newAdmin.role,
      phone: newAdmin.phone,
      isActive: newAdmin.isActive,
      isEmailVerified: newAdmin.isEmailVerified,
      loginAttempts: newAdmin.loginAttempts,
      accountLocked: newAdmin.accountLocked,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Created new admin: ${newAdmin.email}`);
    
    // Test the password
    const testUser = await User.findOne({ email: newAdmin.email }).select('+password');
    const isMatch = await testUser.comparePassword(newAdmin.password);
    console.log(`🔑 Password test: ${isMatch ? 'SUCCESS' : 'FAILED'}`);
    
    // Display all admin users
    const allAdmins = await User.find({ role: { $in: ['admin', 'super admin'] } });
    console.log('\n📋 All admin users:');
    allAdmins.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Active: ${user.isActive} - Verified: ${user.isEmailVerified}`);
    });

    console.log('\n🎉 New admin user created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('Email: newadmin@blacklocust.com');
    console.log('Password: NewAdmin@123456');
    console.log('URL: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the function
createNewAdmin();
