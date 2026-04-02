import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const HamburgerMenu = ({ isOpen, onClose }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/collections');
        setCollections(response.data.collections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="hamburger-backdrop" onClick={onClose} />
      
      {/* Slide-out Menu */}
      <div className={`hamburger-menu-slide ${isOpen ? 'open' : ''}`}>
        <div className="hamburger-menu-header">
          <h3>Collections</h3>
          <button className="hamburger-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="hamburger-menu-content">
          {loading ? (
            <div className="hamburger-loading">
              <div className="loading-spinner"></div>
              <p>Loading collections...</p>
            </div>
          ) : (
            <div className="hamburger-collections">
              {collections.map((collection) => (
                <Link
                  key={collection._id}
                  to={`/collection/${collection.slug}`}
                  className="hamburger-collection-item"
                  onClick={onClose}
                >
                  <div className="hamburger-collection-image">
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80';
                      }}
                    />
                  </div>
                  <div className="hamburger-collection-info">
                    <h4>{collection.name}</h4>
                    <p>{collection.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="hamburger-menu-footer">
          <Link to="/collections" className="view-all-collections" onClick={onClose}>
            <FaShoppingBag />
            View All Collections
          </Link>
          <div className="hamburger-auth-actions">
            {isAuthenticated ? (
              <button
                type="button"
                className="hamburger-auth-btn hamburger-auth-btn--outline"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hamburger-auth-btn hamburger-auth-btn--primary"
                  onClick={onClose}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hamburger-auth-btn hamburger-auth-btn--outline"
                  onClick={onClose}
                >
                  Registration
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
