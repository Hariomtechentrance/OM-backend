import PromoBanner from '../models/PromoBanner.js';

// Get promo banner
export const getPromoBanner = async (req, res) => {
  try {
    const banner = await PromoBanner.getBanner();
    res.json({
      success: true,
      banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update promo banner
export const updatePromoBanner = async (req, res) => {
  try {
    const { text, isActive, backgroundColor, textColor, link, animationSpeed } = req.body;

    let banner = await PromoBanner.findOne();
    
    if (!banner) {
      banner = await PromoBanner.create(req.body);
    } else {
      if (text !== undefined) banner.text = text;
      if (isActive !== undefined) banner.isActive = isActive;
      if (backgroundColor !== undefined) banner.backgroundColor = backgroundColor;
      if (textColor !== undefined) banner.textColor = textColor;
      if (link !== undefined) banner.link = link;
      if (animationSpeed !== undefined) banner.animationSpeed = animationSpeed;
      
      await banner.save();
    }

    res.json({
      success: true,
      message: 'Promo banner updated successfully',
      banner
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle promo banner status
export const togglePromoBanner = async (req, res) => {
  try {
    const banner = await PromoBanner.getBanner();
    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({
      success: true,
      message: `Promo banner ${banner.isActive ? 'enabled' : 'disabled'} successfully`,
      banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
