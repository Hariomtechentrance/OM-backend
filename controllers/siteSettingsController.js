import SiteSettings from '../models/SiteSettings.js';

export async function getShopSettings(req, res) {
  try {
    let doc = await SiteSettings.findById('shop').lean();
    if (!doc) {
      const created = await SiteSettings.create({
        _id: 'shop',
        globalDiscountEnabled: true,
        globalDiscountPercent: 50
      });
      doc = created.toObject();
    }
    return res.json({ success: true, settings: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateShopSettings(req, res) {
  try {
    const { globalDiscountEnabled, globalDiscountPercent } = req.body;
    const update = {};
    if (typeof globalDiscountEnabled === 'boolean') {
      update.globalDiscountEnabled = globalDiscountEnabled;
    }
    if (globalDiscountPercent !== undefined && globalDiscountPercent !== null) {
      const n = Number(globalDiscountPercent);
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        return res.status(400).json({
          success: false,
          message: 'globalDiscountPercent must be a number from 0 to 100'
        });
      }
      update.globalDiscountPercent = n;
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }

    const doc = await SiteSettings.findByIdAndUpdate(
      'shop',
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, settings: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
