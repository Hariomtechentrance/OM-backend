const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { hashPassword } = require('./middleware/security');

const seedAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/black-locust');
    console.log('Connected to MongoDB');

    // Clear existing users (optional - remove if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Create admin users
    const adminUsers = [
      {
        name: 'Admin User',
        email: 'admin@blacklocust.com',
        password: 'Admin@123456',
        role: 'admin',
        phone: '+1234567890',
        isEmailVerified: true
      },
      {
        name: 'Super Admin',
        email: 'superadmin@blacklocust.com',
        password: 'SuperAdmin@123456',
        role: 'super admin',
        phone: '+1234567891',
        isEmailVerified: true
      }
    ];

    for (const adminData of adminUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: adminData.email });
      
      if (existingUser) {
        console.log(`User ${adminData.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await hashPassword(adminData.password);
      
      // Create user
      const user = new User({
        ...adminData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created ${adminData.role}: ${adminData.email}`);
    }

    // Display all users
    const allUsers = await User.find({});
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });

    console.log('\n🎉 Admin users seeded successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@blacklocust.com / Admin@123456');
    console.log('Super Admin: superadmin@blacklocust.com / SuperAdmin@123456');

  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the seed function
seedAdminUsers();
