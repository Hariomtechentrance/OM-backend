import mongoose from 'mongoose';

/**
 * Singleton shop settings document (fixed _id: 'shop').
 */
const siteSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'shop' },
    globalDiscountEnabled: { type: Boolean, default: true },
    globalDiscountPercent: { type: Number, default: 50, min: 0, max: 100 }
  },
  { collection: 'sitesettings', timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
