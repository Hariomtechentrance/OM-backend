import User from '../models/userModel.js';

/**
 * Super admin — plain password; schema pre-save performs single bcrypt hash.
 */
const createSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ role: 'super admin' });

    if (existing) {
      console.log('✅ Super admin already exists');
      return;
    }

    await User.create({
      name: 'Super Admin',
      email: 'superadmin@blacklocust.com',
      password: 'Admin@123',
      role: 'super admin',
      isActive: true
    });

    console.log('🚀 Super Admin created: superadmin@blacklocust.com / Admin@123');
  } catch (error) {
    console.error('❌ Super admin creation error:', error);
  }
};

export default createSuperAdmin;
