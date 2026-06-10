import User from '../models/userModel.js';

/**
 * Default dashboard admin (documented credentials).
 * Password must be PLAIN TEXT — userModel pre('save') hashes it once.
 * (Pre-hashing here caused double-hash and permanent login failure.)
 */
const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@blacklocust.com';
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      console.warn('[createAdmin] ADMIN_PASSWORD env var not set — skipping admin seed');
      return;
    }

    const existing = await User.findOne({ email });

    if (existing) {
      console.log('✅ Admin already exists:', email);
      return existing;
    }

    await User.create({
      name: 'Admin User',
      email,
      password,
      role: 'admin',
      isActive: true
    });

    console.log('🚀 Admin created:', email);
    return true;
  } catch (error) {
    console.error('❌ Admin creation error:', error);
    throw error;
  }
};

export default createAdmin;
