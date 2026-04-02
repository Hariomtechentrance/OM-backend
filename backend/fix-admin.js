import mongoose from 'mongoose';
import User from './models/userModel.js';

mongoose.connect('mongodb://localhost:27017/blacklocust')
  .then(async () => {
    console.log('Connected to blacklocust database');
    
    const adminUser = await User.findOne({ email: 'admin@blacklocust.com' });
    
    if (adminUser) {
      console.log('Admin user found:');
      console.log('- Email:', adminUser.email);
      console.log('- Name:', adminUser.name);
      console.log('- Role:', adminUser.role);
      console.log('- ID:', adminUser._id);
      
      // Create a new password for testing
      const newPassword = 'admin123';
      adminUser.password = newPassword;
      await adminUser.save();
      
      console.log('✅ Admin password updated to:', newPassword);
      console.log('You can now login with:');
      console.log('Email: admin@blacklocust.com');
      console.log('Password: admin123');
    } else {
      console.log('❌ Admin user not found');
      
      // Create admin user
      const newAdmin = await User.create({
        name: 'Admin User',
        email: 'admin@blacklocust.com',
        password: 'admin123',
        role: 'admin'
      });
      
      console.log('✅ Admin user created:');
      console.log('Email: admin@blacklocust.com');
      console.log('Password: admin123');
      console.log('Role: admin');
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });
