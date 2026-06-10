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

    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@blacklocust.com';
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!password) {
      console.warn('[createSuperAdmin] SUPER_ADMIN_PASSWORD env var not set — skipping super admin seed');
      return;
    }

    await User.create({
      name: 'Super Admin',
      email,
      password,
      role: 'super admin',
      isActive: true
    });

    console.log('🚀 Super Admin created:', email);
  } catch (error) {
    console.error('❌ Super admin creation error:', error);
  }
};

export default createSuperAdmin;
