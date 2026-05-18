import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PromoBanner from './models/PromoBanner.js';

dotenv.config();

const enableBanner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const banner = await PromoBanner.findOne();
    if (banner) {
      banner.isActive = true;
      banner.text = '🎉 Grab a discount up to 30% off! Limited time offer! 🎉';
      banner.backgroundColor = '#000000';
      banner.textColor = '#ffffff';
      banner.animationSpeed = 30;
      await banner.save();
      console.log('✅ Banner enabled successfully!');
      console.log('Banner details:', {
        text: banner.text,
        isActive: banner.isActive,
        backgroundColor: banner.backgroundColor,
        textColor: banner.textColor
      });
    } else {
      console.log('❌ No banner found in database');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

enableBanner();
