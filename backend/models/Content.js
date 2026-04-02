const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'hero',
      'navigation',
      'about',
      'contact',
      'payment',
      'footer',
      'collection',
      'shop',
      'new-arrivals',
      'summer-collection',
      'product-detail',
      'cart',
      'checkout',
      'user-profile',
      'site-settings'
    ]
  },
  name: {
    type: String,
    required: true
  },
  content: {
    // Hero Section
    title: String,
    subtitle: String,
    images: [String],
    buttons: [{
      text: String,
      link: String,
      style: {
        type: String,
        enum: ['primary', 'secondary', 'outline']
      }
    }],
    backgroundColor: String,
    textColor: String,
    
    // Navigation
    menuItems: [{
      label: String,
      link: String,
      dropdown: [String],
      order: Number,
      isActive: Boolean
    }],
    
    // About Us
    companyInfo: {
      companyName: String,
      description: String,
      history: String,
      mission: String,
      team: [{
        name: String,
        position: String,
        bio: String,
        image: String
      }]
    },
    
    // Contact Us
    contactInfo: {
      address: String,
      phone: String,
      email: String,
      mapUrl: String,
      hours: String,
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String
      }
    },
    
    // Payment Page
    paymentMethods: [{
      name: String,
      description: String,
      icon: String,
      isActive: Boolean,
      instructions: String
    }],
    
    // Footer
    footerContent: {
      copyright: String,
      links: [{
        category: String,
        items: [{
          label: String,
          link: String
        }]
      }],
      socialLinks: [{
        platform: String,
        url: String,
        icon: String
      }]
    },
    
    // Collection Pages
    collectionInfo: {
      title: String,
      description: String,
      bannerImage: String,
      products: [String], // Product IDs
      layout: {
        type: String,
        enum: ['grid', 'list', 'masonry']
      }
    },
    
    // Shop Pages
    shopInfo: {
      title: String,
      description: String,
      filters: [{
        name: String,
        type: String,
        options: [String]
      }],
      sortBy: [{
        label: String,
        value: String,
        order: Number
      }]
    },
    
    // Site Settings
    siteSettings: {
      siteName: String,
      siteDescription: String,
      logo: String,
      favicon: String,
      primaryColor: String,
      secondaryColor: String,
      currency: String,
      contactEmail: String,
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        youtube: String
      }
    },
    
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String
    },
    
    // Layout
    layout: {
      template: String,
      customCSS: String,
      customJS: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static methods for content management
contentSchema.statics.getContent = async function(type, name) {
  return await this.findOne({ type, name, isActive: true });
};

contentSchema.statics.updateContent = async function(type, name, content) {
  return await this.findOneAndUpdate(
    { type, name },
    { 
      content, 
      updatedAt: new Date(),
      isActive: true 
    },
    { new: true, upsert: true }
  );
};

contentSchema.statics.getAllContent = async function(type) {
  return await this.find({ type, isActive: true }).sort({ updatedAt: -1 });
};

contentSchema.statics.deleteContent = async function(id) {
  return await this.findByIdAndDelete(id);
};

module.exports = mongoose.model('Content', contentSchema);
