const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/black-locust')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Simplified content that matches the current schema
const websiteContent = {
  // Hero Section Content
  hero: {
    type: 'hero',
    name: 'main',
    content: {
      title: 'Welcome to Black Locust Fashion',
      subtitle: 'Discover Premium Quality Fashion for Every Style',
      images: [
        '/images/hero-1.jpg',
        '/images/hero-2.jpg',
        '/images/hero-3.jpg'
      ],
      buttons: [
        {
          text: 'Shop Now',
          link: '/shop',
          style: 'primary'
        },
        {
          text: 'View Collections',
          link: '/collections',
          style: 'secondary'
        }
      ],
      backgroundColor: '#000000',
      textColor: '#ffffff'
    }
  },

  // Navigation Menu Content
  navigation: {
    type: 'navigation',
    name: 'main',
    content: {
      menuItems: [
        {
          label: 'Home',
          link: '/',
          dropdown: [],
          order: 1,
          isActive: true
        },
        {
          label: 'Shop',
          link: '/shop',
          dropdown: ['New Arrivals', 'Summer Collection', 'Party Wear', 'Casual'],
          order: 2,
          isActive: true
        },
        {
          label: 'Collections',
          link: '/collections',
          dropdown: ['Summer 2024', 'Party Wear', 'Office Wear', 'Casual'],
          order: 3,
          isActive: true
        },
        {
          label: 'About',
          link: '/about',
          dropdown: [],
          order: 4,
          isActive: true
        },
        {
          label: 'Contact',
          link: '/contact',
          dropdown: [],
          order: 5,
          isActive: true
        }
      ]
    }
  },

  // About Us Page Content
  about: {
    type: 'about',
    name: 'main',
    content: {
      companyInfo: {
        companyName: 'Black Locust Fashion',
        description: 'Black Locust Fashion is a premium fashion brand dedicated to providing high-quality, stylish clothing for the modern individual.',
        history: 'Founded in 2020, Black Locust Fashion started as a small boutique with a vision to revolutionize the fashion industry.',
        mission: 'Our mission is to provide exceptional fashion that empowers individuals to express their unique style.',
        team: [
          {
            name: 'Sarah Johnson',
            position: 'Founder & CEO',
            bio: 'Sarah brings over 15 years of fashion industry experience.',
            image: '/images/team/sarah.jpg'
          },
          {
            name: 'Michael Chen',
            position: 'Creative Director',
            bio: 'Michael leads our design team with innovative concepts.',
            image: '/images/team/michael.jpg'
          }
        ]
      }
    }
  },

  // Contact Us Page Content
  contact: {
    type: 'contact',
    name: 'main',
    content: {
      contactInfo: {
        address: '123 Fashion Avenue, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'info@blacklocust.com',
        mapUrl: 'https://maps.google.com/?q=Black+Locust+Fashion+New+York',
        hours: 'Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 11:00 AM - 5:00 PM',
        socialMedia: {
          facebook: 'https://facebook.com/blacklocustfashion',
          twitter: 'https://twitter.com/blacklocust',
          instagram: 'https://instagram.com/blacklocustfashion',
          linkedin: 'https://linkedin.com/company/black-locust-fashion'
        }
      }
    }
  },

  // Payment Methods Content
  payment: {
    type: 'payment',
    name: 'main',
    content: {
      paymentMethods: [
        {
          name: 'Credit/Debit Card',
          description: 'Pay securely with your Visa, Mastercard, or American Express card.',
          icon: '/images/payment/credit-card.png',
          isActive: true,
          instructions: 'Enter your card details securely.'
        },
        {
          name: 'PayPal',
          description: 'Pay with your PayPal account for fast and secure checkout.',
          icon: '/images/payment/paypal.png',
          isActive: true,
          instructions: 'Log in to your PayPal account to complete payment.'
        },
        {
          name: 'Cash on Delivery',
          description: 'Pay cash when your order arrives. Available for select locations.',
          icon: '/images/payment/cod.png',
          isActive: true,
          instructions: 'Pay the exact amount in cash when delivered.'
        }
      ]
    }
  },

  // Footer Section Content
  footer: {
    type: 'footer',
    name: 'main',
    content: {
      footerContent: {
        copyright: '© 2024 Black Locust Fashion. All rights reserved.',
        links: [
          {
            category: 'Shop',
            items: [
              { label: 'New Arrivals', link: '/new-arrivals' },
              { label: 'Collections', link: '/collections' },
              { label: 'Sale', link: '/sale' }
            ]
          },
          {
            category: 'Customer Service',
            items: [
              { label: 'Contact Us', link: '/contact' },
              { label: 'Shipping Info', link: '/shipping' },
              { label: 'Returns', link: '/returns' }
            ]
          },
          {
            category: 'About',
            items: [
              { label: 'Our Story', link: '/about' },
              { label: 'Sustainability', link: '/sustainability' },
              { label: 'Careers', link: '/careers' }
            ]
          }
        ],
        socialLinks: [
          {
            platform: 'Facebook',
            url: 'https://facebook.com/blacklocustfashion',
            icon: 'fab fa-facebook-f'
          },
          {
            platform: 'Instagram',
            url: 'https://instagram.com/blacklocustfashion',
            icon: 'fab fa-instagram'
          },
          {
            platform: 'Twitter',
            url: 'https://twitter.com/blacklocust',
            icon: 'fab fa-twitter'
          }
        ]
      }
    }
  },

  // New Arrivals Collection
  'collection-new-arrivals': {
    type: 'collection',
    name: 'new-arrivals',
    content: {
      collectionInfo: {
        title: 'New Arrivals - Summer 2024',
        description: 'Discover our latest collection featuring the hottest trends of the season.',
        bannerImage: '/images/collections/new-arrivals-banner.jpg',
        products: ['product1', 'product2', 'product3', 'product4', 'product5', 'product6'],
        layout: 'grid'
      }
    }
  },

  // Summer Collection
  'collection-summer': {
    type: 'collection',
    name: 'summer',
    content: {
      collectionInfo: {
        title: 'Summer Collection 2024',
        description: 'Embrace the sunshine with our stunning summer collection.',
        bannerImage: '/images/collections/summer-banner.jpg',
        products: ['product7', 'product8', 'product9', 'product10', 'product11', 'product12'],
        layout: 'masonry'
      }
    }
  },

  // Shop Page (simplified)
  shop: {
    type: 'shop',
    name: 'main',
    content: {
      shopInfo: {
        title: 'Shop Our Collection',
        description: 'Explore our complete range of premium fashion items.',
        filters: ['Category', 'Size', 'Color', 'Price Range'],
        sortBy: [
          { label: 'Featured', value: 'featured', order: 1 },
          { label: 'Price: Low to High', value: 'price-asc', order: 2 },
          { label: 'Price: High to Low', value: 'price-desc', order: 3 },
          { label: 'New Arrivals', value: 'newest', order: 4 }
        ]
      }
    }
  },

  // Shopping Cart
  cart: {
    type: 'cart',
    name: 'main',
    content: {
      title: 'Shopping Cart',
      emptyMessage: 'Your cart is empty. Start shopping to add items to your cart!',
      shippingMessage: 'Free shipping on orders over $100'
    }
  },

  // Checkout Page
  checkout: {
    type: 'checkout',
    name: 'main',
    content: {
      title: 'Secure Checkout',
      instructions: 'Complete your order in just a few simple steps.',
      securityMessage: 'Your payment information is encrypted and secure.'
    }
  },

  // User Profile
  'user-profile': {
    type: 'user-profile',
    name: 'main',
    content: {
      title: 'My Account',
      welcomeMessage: 'Welcome back! Manage your account settings and view your order history.'
    }
  },

  // Site Settings
  'site-settings': {
    type: 'site-settings',
    name: 'main',
    content: {
      siteSettings: {
        siteName: 'Black Locust Fashion',
        siteDescription: 'Premium fashion brand offering high-quality clothing and accessories.',
        logo: '/images/logo-black-locust.png',
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        currency: 'USD',
        contactEmail: 'info@blacklocust.com'
      },
      seo: {
        title: 'Black Locust Fashion - Premium Quality Clothing',
        description: 'Discover premium fashion at Black Locust. High-quality clothing and accessories.',
        keywords: ['fashion', 'clothing', 'premium', 'style', 'black locust']
      }
    }
  }
};

// Function to populate content
async function populateContent() {
  try {
    console.log('Starting content population...');
    
    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');
    
    // Add all content types
    const contentEntries = Object.values(websiteContent);
    
    for (const entry of contentEntries) {
      const content = new Content(entry);
      await content.save();
      console.log(`✅ Added: ${entry.type} - ${entry.name}`);
    }
    
    console.log('\n🎉 Content population completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Total content entries: ${contentEntries.length}`);
    console.log('- All website content is now available in the database');
    console.log('- You can now edit this content from the admin panel');
    console.log('- Admin URL: http://localhost:3000/admin/content');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Start your backend server (npm run dev)');
    console.log('2. Start your frontend server (npm start)');
    console.log('3. Navigate to admin panel');
    console.log('4. Click "Content Management" → "Page Manager"');
    console.log('5. Select any content type to see and edit the data');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('Error populating content:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the population
populateContent();
