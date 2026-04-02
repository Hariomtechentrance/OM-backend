/**
 * One-time fix: reset admin@blacklocust.com password (fixes old double-hashed passwords).
 * Run: cd backend && node scripts/resetBlacklocustAdmin.js
 */
import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/userModel.js';

const email = 'admin@blacklocust.com';
const newPassword = 'admin123';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ email });
  if (!user) {
    await User.create({
      name: 'Admin User',
      email,
      password: newPassword,
      role: 'admin',
      isActive: true
    });
    console.log('✅ Created', email);
  } else {
    user.password = newPassword;
    user.role = 'admin';
    user.isActive = true;
    await user.save();
    console.log('✅ Password reset for', email);
  }
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
