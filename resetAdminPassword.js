import mongoose from 'mongoose';
import User from './models/userModel.js';
import 'dotenv/config';

const resetAdminPassword = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin@blacklocust.com';
    const newPassword = 'admin123';

    // Find admin user
    const admin = await User.findOne({ email });

    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      await User.create({
        name: 'Admin User',
        email,
        password: newPassword,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created successfully!');
    } else {
      // Update password (pre-save hook will hash it)
      admin.password = newPassword;
      await admin.save();
      console.log('✅ Admin password reset successfully!');
    }

    console.log('\n📧 Email: admin@blacklocust.com');
    console.log('🔑 Password: admin123');
    console.log('\n✅ You can now login with these credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdminPassword();
