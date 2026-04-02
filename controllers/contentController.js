const Content = require('../models/Content');

// Get specific content
exports.getContent = async (req, res) => {
  try {
    const { type, name } = req.params;
    
    let content;
    if (name) {
      content = await Content.getContent(type, name);
    } else {
      content = await Content.getAllContent(type);
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
};

// Update content
exports.updateContent = async (req, res) => {
  try {
    const { type, name, content } = req.body;
    
    if (!type || !name || !content) {
      return res.status(400).json({
        success: false,
        message: 'Type, name, and content are required'
      });
    }
    
    const updatedContent = await Content.updateContent(type, name, content);
    
    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content'
    });
  }
};

// Create new content
exports.createContent = async (req, res) => {
  try {
    const { type, name, content } = req.body;
    
    if (!type || !name || !content) {
      return res.status(400).json({
        success: false,
        message: 'Type, name, and content are required'
      });
    }
    
    const newContent = new Content({
      type,
      name,
      content,
      isActive: true
    });
    
    await newContent.save();
    
    res.status(201).json({
      success: true,
      data: newContent,
      message: 'Content created successfully'
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content'
    });
  }
};

// Delete content
exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Content.deleteContent(id);
    
    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content'
    });
  }
};

// Get all content types
exports.getAllContentTypes = async (req, res) => {
  try {
    const contentTypes = [
      { type: 'hero', name: 'main', label: 'Hero Section' },
      { type: 'navigation', name: 'main', label: 'Navigation Menu' },
      { type: 'about', name: 'main', label: 'About Us Page' },
      { type: 'contact', name: 'main', label: 'Contact Us Page' },
      { type: 'payment', name: 'main', label: 'Payment Methods' },
      { type: 'footer', name: 'main', label: 'Footer Section' },
      { type: 'collection', name: 'new-arrivals', label: 'New Arrivals' },
      { type: 'collection', name: 'summer', label: 'Summer Collection' },
      { type: 'shop', name: 'main', label: 'Shop Page' },
      { type: 'cart', name: 'main', label: 'Shopping Cart' },
      { type: 'checkout', name: 'main', label: 'Checkout Page' },
      { type: 'user-profile', name: 'main', label: 'User Profile' },
      { type: 'site-settings', name: 'main', label: 'Site Settings' }
    ];
    
    res.status(200).json({
      success: true,
      data: contentTypes
    });
  } catch (error) {
    console.error('Get content types error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content types'
    });
  }
};

// Hero specific endpoints (keep existing)
exports.getHeroContent = async (req, res) => {
  try {
    const heroContent = await Content.getContent('hero', 'main');
    
    if (!heroContent) {
      // Create default hero content if none exists
      const defaultHero = new Content({
        type: 'hero',
        name: 'main',
        content: {
          title: 'Welcome to Black Locust',
          subtitle: 'Discover Premium Fashion',
          images: [],
          buttons: [
            { text: 'Shop Now', link: '/shop', style: 'primary' },
            { text: 'Learn More', link: '/about', style: 'secondary' }
          ],
          backgroundColor: '#000000',
          textColor: '#ffffff'
        },
        isActive: true
      });
      await defaultHero.save();
      return res.status(200).json({
        success: true,
        data: defaultHero.content
      });
    }
    
    res.status(200).json({
      success: true,
      data: heroContent.content
    });
  } catch (error) {
    console.error('Get hero content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero content'
    });
  }
};

exports.saveHeroContent = async (req, res) => {
  try {
    const heroContent = req.body;
    
    await Content.updateContent('hero', 'main', heroContent);
    
    res.status(200).json({
      success: true,
      message: 'Hero content saved successfully'
    });
  } catch (error) {
    console.error('Save hero content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save hero content'
    });
  }
};
