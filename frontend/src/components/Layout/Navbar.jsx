import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaChevronRight } from 'react-icons/fa';
import api from '../../api/axios';

const HamburgerMenu = ({ isOpen, onClose }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await api.get('/collections');
        // Filter only sub-collections (collectionType: 'sub')
        const subCollections = response.data.collections || [];
        setCollections(subCollections);
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

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-out menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Collections</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-black transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Collections List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="py-4">
              {collections.map((collection) => (
                <Link
                  key={collection._id}
                  to={`/collection/${collection.slug}`}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {collection.image && (
                      <img 
                        src={collection.image} 
                        alt={collection.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-black">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-sm" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-center text-sm text-gray-500">
            <p>13 Collections Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
