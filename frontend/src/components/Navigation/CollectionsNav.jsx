import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import './CollectionsNav.css';

const CollectionsNav = () => {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchCollections();

    const handleStorageChange = (e) => {
      if (e.key === 'collections') {
        fetchCollections();
      }
    };

    const interval = setInterval(() => {
      fetchCollections();
    }, 30000);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await api.get(
        '/collections?showInNavbar=true&isActive=true&sortBy=order&sortOrder=asc'
      );
      if (res.data?.success) {
        setCollections(res.data.collections || []);
      }
    } catch (error) {
      console.error('Failed to fetch collections for nav:', error);
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.closest('.collections-dropdown') === null) {
      setCollectionsOpen(false);
    }
  };

  useEffect(() => {
    if (collectionsOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [collectionsOpen]);

  useEffect(() => {
    setCollectionsOpen(false);
  }, [location.pathname]);

  return (
    <div className="collections-dropdown">
      <button
        className={`collections-toggle ${collectionsOpen ? 'active' : ''}`}
        onClick={() => setCollectionsOpen(!collectionsOpen)}
      >
        Collections
      </button>

      {collectionsOpen && (
        <div className="collections-menu">
          {collections.map((col) => (
            <Link
              key={col._id}
              to={`/collection/${col.slug}`}
              className="collection-link"
              onClick={() => setCollectionsOpen(false)}
            >
              {col.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsNav;
