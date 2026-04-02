import React from 'react';
import { Link } from 'react-router-dom';
import './SitemapPage.css';

const SitemapPage = () => {
  const mainCategories = [
    {
      title: 'Shop',
      items: [
        { name: 'All Products', link: '/products' },
        { name: 'New Arrivals', link: '/new-arrivals' },
        { name: 'Men\'s Collection', link: '/products?category=men' },
        { name: 'Women\'s Collection', link: '/products?category=women' },
        { name: 'Kids Collection', link: '/products?category=kids' },
        { name: 'Sale', link: '/sale' }
      ]
    },
    {
      title: 'Product Categories',
      items: [
        { name: 'Shirts', link: '/products?category=shirts' },
        { name: 'Pants', link: '/products?category=pants' },
        { name: 'Dresses', link: '/products?category=dresses' },
        { name: 'Outerwear', link: '/products?category=outerwear' },
        { name: 'Accessories', link: '/products?category=accessories' },
        { name: 'Footwear', link: '/products?category=footwear' }
      ]
    },
    {
      title: 'Collections',
      items: [
        { name: 'Summer Collection', link: '/collection/summer' },
        { name: 'Winter Collection', link: '/collection/winter' },
        { name: 'Formal Wear', link: '/collection/formal' },
        { name: 'Casual Wear', link: '/collection/casual' },
        { name: 'Party Wear', link: '/collection/party' },
        { name: 'Office Wear', link: '/collection/office' }
      ]
    }
  ];

  const customerService = [
    {
      title: 'Help & Support',
      items: [
        { name: 'Contact Us', link: '/contact' },
        { name: 'FAQ', link: '/faq' },
        { name: 'Shipping & Returns', link: '/shipping-returns' },
        { name: 'Size Guide', link: '/size-guide' },
        { name: 'Care Instructions', link: '/care' },
        { name: 'Track Order', link: '/track-order' }
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'My Account', link: '/profile' },
        { name: 'Login', link: '/login' },
        { name: 'Register', link: '/register' },
        { name: 'Order History', link: '/profile/orders' },
        { name: 'Wishlist', link: '/profile/wishlist' },
        { name: 'Addresses', link: '/profile/addresses' }
      ]
    }
  ];

  const companyInfo = [
    {
      title: 'About Black Locust',
      items: [
        { name: 'About Us', link: '/about' },
        { name: 'Our Story', link: '/about/story' },
        { name: 'Mission & Values', link: '/about/mission' },
        { name: 'Sustainability', link: '/about/sustainability' },
        { name: 'Careers', link: '/careers' },
        { name: 'Press', link: '/press' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { name: 'Terms of Service', link: '/terms' },
        { name: 'Privacy Policy', link: '/privacy' },
        { name: 'Cookie Policy', link: '/cookies' },
        { name: 'Accessibility', link: '/accessibility' },
        { name: 'Disclaimer', link: '/disclaimer' },
        { name: 'Compliance', link: '/compliance' }
      ]
    }
  ];

  const usefulLinks = [
    {
      title: 'Quick Links',
      items: [
        { name: 'Homepage', link: '/' },
        { name: 'Search', link: '/search' },
        { name: 'Cart', link: '/cart' },
        { name: 'Checkout', link: '/checkout' },
        { name: 'Gift Cards', link: '/gift-cards' },
        { name: 'Student Discount', link: '/student-discount' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { name: 'Blog', link: '/blog' },
        { name: 'Lookbook', link: '/lookbook' },
        { name: 'Style Guide', link: '/style-guide' },
        { name: 'Fabric Guide', link: '/fabric-guide' },
        { name: 'Store Locator', link: '/store-locator' },
        { name: 'Mobile App', link: '/mobile-app' }
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <div className="container">
        <div className="page-header">
          <h1>Sitemap</h1>
          <p>Navigate through all pages and sections of the Black Locust website</p>
        </div>

        <div className="sitemap-grid">
          <div className="sitemap-section">
            <h2>Shopping</h2>
            <div className="sitemap-columns">
              {mainCategories.map((category, index) => (
                <div key={index} className="sitemap-column">
                  <h3>{category.title}</h3>
                  <ul>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link to={item.link}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="sitemap-section">
            <h2>Customer Service</h2>
            <div className="sitemap-columns">
              {customerService.map((category, index) => (
                <div key={index} className="sitemap-column">
                  <h3>{category.title}</h3>
                  <ul>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link to={item.link}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="sitemap-section">
            <h2>Company Information</h2>
            <div className="sitemap-columns">
              {companyInfo.map((category, index) => (
                <div key={index} className="sitemap-column">
                  <h3>{category.title}</h3>
                  <ul>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link to={item.link}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="sitemap-section">
            <h2>Resources & Tools</h2>
            <div className="sitemap-columns">
              {usefulLinks.map((category, index) => (
                <div key={index} className="sitemap-column">
                  <h3>{category.title}</h3>
                  <ul>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link to={item.link}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sitemap-stats">
          <div className="stats-card">
            <h3>Website Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">25+</div>
                <div className="stat-label">Collections</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Pages</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sitemap-footer">
          <div className="footer-info">
            <h3>Can't Find What You're Looking For?</h3>
            <p>Try our search function or contact our customer service team for assistance.</p>
            <div className="footer-actions">
              <Link to="/search" className="btn btn-primary">Search Website</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
