import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CategoriesNav.css';

const CategoriesNav = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchCollections();
    
    // Debug: Log current localStorage content
    const currentCollections = JSON.parse(localStorage.getItem('collections') || '[]');
    console.log('=== COLLECTIONS DEBUG ===');
    console.log('Collections in localStorage:', currentCollections);
    console.log('Collections length:', currentCollections.length);
    console.log('========================');
    
    // Listen for storage changes to update collections when new ones are added from admin
    const handleStorageChange = (e) => {
      if (e.key === 'collections') {
        const localCollections = JSON.parse(localStorage.getItem('collections') || '[]');
        if (localCollections.length > 0) {
          setCollections(localCollections);
        }
      }
    };
    
    // Also check periodically for new collections (fallback)
    const interval = setInterval(() => {
      const localCollections = JSON.parse(localStorage.getItem('collections') || '[]');
      if (localCollections.length > 0) {
        setCollections(localCollections);
      }
    }, 5000); // Check every 5 seconds
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const fetchCollections = async () => {
    try {
      // Start with original hardcoded collections - always present
      let allCollections = [
        { name: 'Party Wear', slug: 'party-wear', icon: '🎉' },
        { name: 'Casual', slug: 'casual', icon: '👕' },
        { name: 'Polo T-shirts', slug: 'polo-tshirts', icon: '👔' },
        { name: 'New Collection', slug: 'new-collection', icon: '✨' },
        { name: 'Striped Collections', slug: 'striped-collection', icon: '📦' },
        { name: 'Cargo Collection', slug: 'cargo-collection', icon: '🎒' },
        { name: 'Trousers Collection', slug: 'trousers-collection', icon: '👖' },
        { name: 'Denim Collection', slug: 'denim-collection', icon: '👖' },
        { name: 'Winter Collection', slug: 'winter-collection', icon: '❄️' },
        { name: 'Formal Pants', slug: 'formal-pants', icon: '👔' },
        { name: 'Summer Final', slug: 'summer-final', icon: '☀️' },
        { name: 'Office Collections', slug: 'office-collection', icon: '💼' },
        { name: 'Checked Collections', slug: 'checked-collection', icon: '🏁' },
        { name: 'All Products', slug: 'all-products', icon: '📦' }
      ];
      
      // Add admin-created collections to the list (additional to original ones)
      const localCollections = JSON.parse(localStorage.getItem('collections') || '[]');
      if (localCollections.length > 0) {
        allCollections = [...allCollections, ...localCollections];
        console.log('Using original + admin collections:', allCollections);
      }
      
      setCollections(allCollections);
      
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      // Fallback to original hardcoded collections only
      setCollections([
        { name: 'Party Wear', slug: 'party-wear', icon: '🎉' },
        { name: 'Casual', slug: 'casual', icon: '👕' },
        { name: 'Polo T-shirts', slug: 'polo-tshirts', icon: '👔' },
        { name: 'New Collection', slug: 'new-collection', icon: '✨' },
        { name: 'Striped Collections', slug: 'striped-collection', icon: '📦' },
        { name: 'Cargo Collection', slug: 'cargo-collection', icon: '🎒' },
        { name: 'Trousers Collection', slug: 'trousers-collection', icon: '👖' },
        { name: 'Denim Collection', slug: 'denim-collection', icon: '👖' },
        { name: 'Winter Collection', slug: 'winter-collection', icon: '❄️' },
        { name: 'Formal Pants', slug: 'formal-pants', icon: '👔' },
        { name: 'Summer Final', slug: 'summer-final', icon: '☀️' },
        { name: 'Office Collections', slug: 'office-collection', icon: '💼' },
        { name: 'Checked Collections', slug: 'checked-collection', icon: '🏁' },
        { name: 'All Products', slug: 'all-products', icon: '📦' }
      ]);
    }
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const isActive = (slug) => {
    return location.pathname.includes(slug);
  };

  return (
    <div className="categories-nav">
      <button 
        className="categories-toggle"
        onClick={toggleCategories}
      >
        <span className="categories-icon">📂</span>
        <span>Collections</span>
        <span className={`categories-arrow ${categoriesOpen ? 'open' : ''}`}>▼</span>
      </button>

      <div className={`categories-dropdown ${categoriesOpen ? 'open' : ''}`}>
        <div className="collections-grid">
          {collections.map((collection, index) => (
            <Link
              key={collection._id || index}
              to={`/products?collection=${collection.slug}`}
              className={`category-item ${isActive(collection.slug) ? 'active' : ''}`}
              onClick={() => setCategoriesOpen(false)}
            >
              <span className="category-icon">{collection.icon || '📁'}</span>
              <span className="category-name">{collection.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Debug refresh button - remove in production */}
        <div style={{padding: '10px', borderTop: '1px solid #eee'}}>
          <button 
            onClick={() => {
              console.log('Manual refresh triggered');
              fetchCollections();
            }}
            style={{fontSize: '12px', padding: '5px 10px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer'}}
          >
            🔄 Refresh Collections
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesNav;
