import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './PageManager.css';

const PageManager = () => {
  const [selectedContentType, setSelectedContentType] = useState('');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const contentTypes = [
    { type: 'hero', name: 'main', label: 'Hero Section', icon: '🏠' },
    { type: 'navigation', name: 'main', label: 'Navigation Menu', icon: '🧭' },
    { type: 'about', name: 'main', label: 'About Us Page', icon: '📄' },
    { type: 'contact', name: 'main', label: 'Contact Us Page', icon: '📞' },
    { type: 'payment', name: 'main', label: 'Payment Methods', icon: '💳' },
    { type: 'footer', name: 'main', label: 'Footer Section', icon: '🦶' },
    { type: 'collection', name: 'new-arrivals', label: 'New Arrivals', icon: '🆕' },
    { type: 'collection', name: 'summer', label: 'Summer Collection', icon: '☀️' },
    { type: 'shop', name: 'main', label: 'Shop Page', icon: '🛍️' },
    { type: 'cart', name: 'main', label: 'Shopping Cart', icon: '🛒' },
    { type: 'checkout', name: 'main', label: 'Checkout Page', icon: '🧾' },
    { type: 'user-profile', name: 'main', label: 'User Profile', icon: '👤' },
    { type: 'site-settings', name: 'main', label: 'Site Settings', icon: '⚙️' }
  ];

  useEffect(() => {
    if (selectedContentType) {
      fetchContent();
    }
  }, [selectedContentType]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/${selectedContentType}/main`);
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data);
      } else {
        toast.error('Failed to fetch content');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    try {
      setSaving(true);
      const response = await fetch(`/api/content/${selectedContentType}/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Content saved successfully');
      } else {
        toast.error(data.message || 'Failed to save content');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const renderContentEditor = () => {
    if (!content) return <div className="select-content-type">Select a content type to edit</div>;

    switch (selectedContentType) {
      case 'hero':
        return <HeroEditor content={content} onChange={setContent} />;
      case 'navigation':
        return <NavigationEditor content={content} onChange={setContent} />;
      case 'about':
        return <AboutEditor content={content} onChange={setContent} />;
      case 'contact':
        return <ContactEditor content={content} onChange={setContent} />;
      case 'payment':
        return <PaymentEditor content={content} onChange={setContent} />;
      case 'footer':
        return <FooterEditor content={content} onChange={setContent} />;
      case 'collection':
        return <CollectionEditor content={content} onChange={setContent} />;
      case 'shop':
        return <ShopEditor content={content} onChange={setContent} />;
      case 'cart':
        return <CartEditor content={content} onChange={setContent} />;
      case 'checkout':
        return <CheckoutEditor content={content} onChange={setContent} />;
      case 'user-profile':
        return <ProfileEditor content={content} onChange={setContent} />;
      case 'site-settings':
        return <SiteSettingsEditor content={content} onChange={setContent} />;
      default:
        return <div className="no-editor">Select a content type to edit</div>;
    }
  };

  // Simple editor components (placeholder implementations)
  const HeroEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Hero Section Editor</h3>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Enter hero title"
        />
      </div>
      <div className="form-group">
        <label>Subtitle</label>
        <textarea
          value={content?.subtitle || ''}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          placeholder="Enter hero subtitle"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label>Background Color</label>
        <input
          type="color"
          value={content?.backgroundColor || '#000000'}
          onChange={(e) => onChange({ ...content, backgroundColor: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>Text Color</label>
        <input
          type="color"
          value={content?.textColor || '#ffffff'}
          onChange={(e) => onChange({ ...content, textColor: e.target.value })}
        />
      </div>
    </div>
  );

  const NavigationEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Navigation Menu Editor</h3>
      <div className="form-group">
        <label>Menu Items</label>
        <div className="menu-items">
          {content?.menuItems?.map((item, index) => (
            <div key={index} className="menu-item">
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const newMenuItems = [...content.menuItems];
                  newMenuItems[index].label = e.target.value;
                  onChange({ ...content, menuItems: newMenuItems });
                }}
                placeholder="Menu label"
              />
              <input
                type="text"
                value={item.link}
                onChange={(e) => {
                  const newMenuItems = [...content.menuItems];
                  newMenuItems[index].link = e.target.value;
                  onChange({ ...content, menuItems: newMenuItems });
                }}
                placeholder="Menu link"
              />
              <button onClick={() => {
                const newMenuItems = content.menuItems.filter((_, i) => i !== index);
                onChange({ ...content, menuItems: newMenuItems });
              }}>Remove</button>
            </div>
          ))}
          <button onClick={() => {
            const newMenuItems = [...(content?.menuItems || []), { label: '', link: '', order: content?.menuItems?.length || 0, isActive: true }];
            onChange({ ...content, menuItems: newMenuItems });
          }}>Add Menu Item</button>
        </div>
      </div>
    </div>
  );

  const AboutEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>About Us Page Editor</h3>
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          value={content?.companyInfo?.companyName || ''}
          onChange={(e) => onChange({ 
            ...content, 
            companyInfo: { ...content.companyInfo, companyName: e.target.value }
          })}
          placeholder="Enter company name"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={content?.companyInfo?.description || ''}
          onChange={(e) => onChange({ 
            ...content, 
            companyInfo: { ...content.companyInfo, description: e.target.value }
          })}
          placeholder="Enter company description"
          rows={5}
        />
      </div>
      <div className="form-group">
        <label>Mission</label>
        <textarea
          value={content?.companyInfo?.mission || ''}
          onChange={(e) => onChange({ 
            ...content, 
            companyInfo: { ...content.companyInfo, mission: e.target.value }
          })}
          placeholder="Enter company mission"
          rows={3}
        />
      </div>
    </div>
  );

  const ContactEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Contact Us Page Editor</h3>
      <div className="form-group">
        <label>Address</label>
        <input
          type="text"
          value={content?.contactInfo?.address || ''}
          onChange={(e) => onChange({ 
            ...content, 
            contactInfo: { ...content.contactInfo, address: e.target.value }
          })}
          placeholder="Enter address"
        />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={content?.contactInfo?.phone || ''}
          onChange={(e) => onChange({ 
            ...content, 
            contactInfo: { ...content.contactInfo, phone: e.target.value }
          })}
          placeholder="Enter phone number"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={content?.contactInfo?.email || ''}
          onChange={(e) => onChange({ 
            ...content, 
            contactInfo: { ...content.contactInfo, email: e.target.value }
          })}
          placeholder="Enter email address"
        />
      </div>
    </div>
  );

  const PaymentEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Payment Methods Editor</h3>
      <div className="form-group">
        <label>Payment Methods</label>
        <div className="payment-methods">
          {content?.paymentMethods?.map((method, index) => (
            <div key={index} className="payment-method">
              <input
                type="text"
                value={method.name}
                onChange={(e) => {
                  const newMethods = [...content.paymentMethods];
                  newMethods[index].name = e.target.value;
                  onChange({ ...content, paymentMethods: newMethods });
                }}
                placeholder="Payment method name"
              />
              <textarea
                value={method.description}
                onChange={(e) => {
                  const newMethods = [...content.paymentMethods];
                  newMethods[index].description = e.target.value;
                  onChange({ ...content, paymentMethods: newMethods });
                }}
                placeholder="Payment description"
                rows={2}
              />
              <button onClick={() => {
                const newMethods = content.paymentMethods.filter((_, i) => i !== index);
                onChange({ ...content, paymentMethods: newMethods });
              }}>Remove</button>
            </div>
          ))}
          <button onClick={() => {
            const newMethods = [...(content?.paymentMethods || []), { name: '', description: '', isActive: true }];
            onChange({ ...content, paymentMethods: newMethods });
          }}>Add Payment Method</button>
        </div>
      </div>
    </div>
  );

  const FooterEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Footer Section Editor</h3>
      <div className="form-group">
        <label>Copyright Text</label>
        <input
          type="text"
          value={content?.footerContent?.copyright || ''}
          onChange={(e) => onChange({ 
            ...content, 
            footerContent: { ...content.footerContent, copyright: e.target.value }
          })}
          placeholder="Enter copyright text"
        />
      </div>
      <div className="form-group">
        <label>Footer Links</label>
        <div className="footer-links">
          {content?.footerContent?.links?.map((category, catIndex) => (
            <div key={catIndex} className="link-category">
              <input
                type="text"
                value={category.category}
                onChange={(e) => {
                  const newLinks = [...content.footerContent.links];
                  newLinks[catIndex].category = e.target.value;
                  onChange({ ...content, footerContent: { ...content.footerContent, links: newLinks }});
                }}
                placeholder="Category name"
              />
              <div className="link-items">
                {category.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="link-item">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const newLinks = [...content.footerContent.links];
                        newLinks[catIndex].items[itemIndex].label = e.target.value;
                        onChange({ ...content, footerContent: { ...content.footerContent, links: newLinks }});
                      }}
                      placeholder="Link label"
                    />
                    <input
                      type="text"
                      value={item.link}
                      onChange={(e) => {
                        const newLinks = [...content.footerContent.links];
                        newLinks[catIndex].items[itemIndex].link = e.target.value;
                        onChange({ ...content, footerContent: { ...content.footerContent, links: newLinks }});
                      }}
                      placeholder="Link URL"
                    />
                    <button onClick={() => {
                      const newLinks = [...content.footerContent.links];
                      newLinks[catIndex].items = newLinks[catIndex].items.filter((_, i) => i !== itemIndex);
                      onChange({ ...content, footerContent: { ...content.footerContent, links: newLinks }});
                    }}>Remove</button>
                  </div>
                ))}
                <button onClick={() => {
                  const newLinks = [...content.footerContent.links];
                  newLinks[catIndex].items = [...(newLinks[catIndex]?.items || []), { label: '', link: '' }];
                  onChange({ ...content, footerContent: { ...content.footerContent, links: newLinks }});
                }}>Add Link</button>
              </div>
            </div>
          ))}
          <button onClick={() => {
            const newLinks = [...(content?.footerContent?.links || []), { category: '', items: [] }];
            onChange({ ...content, footerContent: { ...content.footerContent, links: newLinks }});
          }}>Add Link Category</button>
        </div>
      </div>
    </div>
  );

  const CollectionEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Collection Page Editor</h3>
      <div className="form-group">
        <label>Collection Title</label>
        <input
          type="text"
          value={content?.collectionInfo?.title || ''}
          onChange={(e) => onChange({ 
            ...content, 
            collectionInfo: { ...content.collectionInfo, title: e.target.value }
          })}
          placeholder="Enter collection title"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={content?.collectionInfo?.description || ''}
          onChange={(e) => onChange({ 
            ...content, 
            collectionInfo: { ...content.collectionInfo, description: e.target.value }
          })}
          placeholder="Enter collection description"
          rows={4}
        />
      </div>
      <div className="form-group">
        <label>Banner Image</label>
        <input
          type="text"
          value={content?.collectionInfo?.bannerImage || ''}
          onChange={(e) => onChange({ 
            ...content, 
            collectionInfo: { ...content.collectionInfo, bannerImage: e.target.value }
          })}
          placeholder="Enter banner image URL"
        />
      </div>
    </div>
  );

  const ShopEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Shop Page Editor</h3>
      <div className="form-group">
        <label>Page Title</label>
        <input
          type="text"
          value={content?.shopInfo?.title || ''}
          onChange={(e) => onChange({ 
            ...content, 
            shopInfo: { ...content.shopInfo, title: e.target.value }
          })}
          placeholder="Enter shop page title"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={content?.shopInfo?.description || ''}
          onChange={(e) => onChange({ 
            ...content, 
            shopInfo: { ...content.shopInfo, description: e.target.value }
          })}
          placeholder="Enter shop description"
          rows={4}
        />
      </div>
    </div>
  );

  const CartEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Shopping Cart Editor</h3>
      <div className="form-group">
        <label>Cart Title</label>
        <input
          type="text"
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Enter cart page title"
        />
      </div>
      <div className="form-group">
        <label>Empty Message</label>
        <textarea
          value={content?.emptyMessage || ''}
          onChange={(e) => onChange({ ...content, emptyMessage: e.target.value })}
          placeholder="Message when cart is empty"
          rows={3}
        />
      </div>
    </div>
  );

  const CheckoutEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Checkout Page Editor</h3>
      <div className="form-group">
        <label>Page Title</label>
        <input
          type="text"
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Enter checkout page title"
        />
      </div>
      <div className="form-group">
        <label>Instructions</label>
        <textarea
          value={content?.instructions || ''}
          onChange={(e) => onChange({ ...content, instructions: e.target.value })}
          placeholder="Enter checkout instructions"
          rows={4}
        />
      </div>
    </div>
  );

  const ProfileEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>User Profile Editor</h3>
      <div className="form-group">
        <label>Page Title</label>
        <input
          type="text"
          value={content?.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Enter profile page title"
        />
      </div>
      <div className="form-group">
        <label>Welcome Message</label>
        <textarea
          value={content?.welcomeMessage || ''}
          onChange={(e) => onChange({ ...content, welcomeMessage: e.target.value })}
          placeholder="Enter welcome message"
          rows={3}
        />
      </div>
    </div>
  );

  const SiteSettingsEditor = ({ content, onChange }) => (
    <div className="editor-section">
      <h3>Site Settings Editor</h3>
      <div className="form-group">
        <label>Site Name</label>
        <input
          type="text"
          value={content?.siteSettings?.siteName || ''}
          onChange={(e) => onChange({ 
            ...content, 
            siteSettings: { ...content.siteSettings, siteName: e.target.value }
          })}
          placeholder="Enter site name"
        />
      </div>
      <div className="form-group">
        <label>Site Description</label>
        <textarea
          value={content?.siteSettings?.siteDescription || ''}
          onChange={(e) => onChange({ 
            ...content, 
            siteSettings: { ...content.siteSettings, siteDescription: e.target.value }
          })}
          placeholder="Enter site description"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label>Logo URL</label>
        <input
          type="text"
          value={content?.siteSettings?.logo || ''}
          onChange={(e) => onChange({ 
            ...content, 
            siteSettings: { ...content.siteSettings, logo: e.target.value }
          })}
          placeholder="Enter logo URL"
        />
      </div>
      <div className="form-group">
        <label>Primary Color</label>
        <input
          type="color"
          value={content?.siteSettings?.primaryColor || '#000000'}
          onChange={(e) => onChange({ 
            ...content, 
            siteSettings: { ...content.siteSettings, primaryColor: e.target.value }
          })}
        />
      </div>
      <div className="form-group">
        <label>Currency</label>
        <input
          type="text"
          value={content?.siteSettings?.currency || 'USD'}
          onChange={(e) => onChange({ 
            ...content, 
            siteSettings: { ...content.siteSettings, currency: e.target.value }
          })}
          placeholder="Enter currency code"
        />
      </div>
    </div>
  );

  return (
    <div className="page-manager">
      <div className="page-manager-header">
        <h1>Complete Website Content Manager</h1>
        <p>Edit every aspect of your website from this admin panel</p>
      </div>
      
      <div className="content-manager-layout">
        <div className="content-types-sidebar">
          <h3>Select Content Type</h3>
          <div className="content-types-list">
            {contentTypes.map((contentType) => (
              <button
                key={contentType.type}
                className={`content-type-btn ${selectedContentType === contentType.type ? 'active' : ''}`}
                onClick={() => setSelectedContentType(contentType.type)}
              >
                <span className="icon">{contentType.icon}</span>
                <span className="label">{contentType.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="content-editor">
          {loading ? (
            <div className="loading">Loading content...</div>
          ) : (
            <>
              {renderContentEditor()}
              <div className="editor-actions">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={!content || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageManager;
