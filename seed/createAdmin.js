import User from '../models/userModel.js';

/**
 * Default dashboard admin (documented credentials).
 * Password must be PLAIN TEXT — userModel pre('save') hashes it once.
 * (Pre-hashing here caused double-hash and permanent login failure.)
 */
const createAdmin = async () => {
  try {
    const email = 'admin@blacklocust.com';
    const existing = await User.findOne({ email });

    if (existing) {
      console.log('✅ Admin already exists:', email);
      return existing;
    }

    await User.create({
      name: 'Admin User',
      email,
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    console.log('🚀 Admin created:', email, '/ admin123');
    return true;
  } catch (error) {
    console.error('❌ Admin creation error:', error);
    throw error;
  }
};

export default createAdmin;
