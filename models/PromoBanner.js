import mongoose from 'mongoose';

const promoBannerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Banner text is required'],
    trim: true,
    maxlength: [200, 'Banner text cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: '#000000'
  },
  textColor: {
    type: String,
    default: '#ffffff'
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  animationSpeed: {
    type: Number,
    default: 30, // seconds for one complete scroll
    min: 10,
    max: 60
  }
}, {
  timestamps: true
});

// Ensure only one banner exists (singleton pattern)
promoBannerSchema.statics.getBanner = async function() {
  let banner = await this.findOne();
  if (!banner) {
    banner = await this.create({
      text: 'Grab a discount up to 30% off! Limited time offer!',
      isActive: false
    });
  }
  return banner;
};

export default mongoose.model('PromoBanner', promoBannerSchema);
