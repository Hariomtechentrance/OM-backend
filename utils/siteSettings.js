import SiteSettings from '../models/SiteSettings.js';

export async function getSiteSettingsDoc() {
  let doc = await SiteSettings.findById('shop').lean();
  if (!doc) {
    const created = await SiteSettings.create({
      _id: 'shop',
      globalDiscountEnabled: true,
      globalDiscountPercent: 50
    });
    doc = created.toObject();
  }
  return doc;
}
