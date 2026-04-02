import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios';
import './CollectionManagement.css';

const CollectionManagement = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    order: 0,
    showInNavbar: true,
    isActive: true,
    showInFeatured: false,
    showOnHome: false,
    collectionType: 'main',
    metaTitle: '',
    metaDescription: '',
    tags: []
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await api.get('/collections?sortBy=order&sortOrder=asc');
      setCollections(response.data.collections);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to fetch collections');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        toast.error('Collection name is required');
        return;
      }

      const payload = {
        ...formData,
        order: formData.order || collections.length + 1
      };

      if (selectedCollection) {
        await api.put(`/collections/${selectedCollection._id}`, payload);
        toast.success('Collection updated successfully');
      } else {
        await api.post('/collections', payload);
        toast.success('Collection created successfully');
      }

      fetchCollections();
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error(error.response?.data?.error || 'Failed to save collection');
    }
  };

  const handleEdit = (collection) => {
    setSelectedCollection(collection);
    setFormData({
      name: collection.name || '',
      description: collection.description || '',
      image: collection.image || '',
      order: collection.order || 0,
      showInNavbar: collection.showInNavbar !== false,
      isActive: collection.isActive !== false,
      showInFeatured: collection.showInFeatured || false,
      showOnHome: collection.showOnHome || false,
      collectionType: collection.collectionType || 'main',
      metaTitle: collection.metaTitle || '',
      metaDescription: collection.metaDescription || '',
      tags: collection.tags || []
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await api.delete(`/collections/${id}`);
        toast.success('Collection deleted successfully');
        fetchCollections();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to delete collection');
      }
    }
  };

  const toggleNavbarVisibility = async (collection) => {
    try {
      await api.put(`/collections/${collection._id}`, {
        showInNavbar: !collection.showInNavbar
      });
      toast.success('Collection visibility updated');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to update collection visibility');
    }
  };

  const toggleActiveStatus = async (collection) => {
    try {
      await api.put(`/collections/${collection._id}`, {
        isActive: !collection.isActive
      });
      toast.success('Collection status updated');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to update collection status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      order: 0,
      showInNavbar: true,
      isActive: true,
      showInFeatured: false,
      showOnHome: false,
      collectionType: 'main',
      metaTitle: '',
      metaDescription: '',
      tags: []
    });
    setSelectedCollection(null);
  };

  const reorderCollections = async (draggedIndex, droppedIndex) => {
    try {
      const newCollections = [...collections];
      const draggedCollection = newCollections[draggedIndex];
      newCollections.splice(draggedIndex, 1);
      newCollections.splice(droppedIndex, 0, draggedCollection);

      const orders = newCollections.map((collection, index) => ({
        id: collection._id,
        order: index + 1
      }));

      await api.put('/collections/reorder', { orders });
      toast.success('Collections reordered successfully');
      fetchCollections();
    } catch (error) {
      toast.error('Failed to reorder collections');
    }
  };

  if (loading) {
    return <div className="loading">Loading collections...</div>;
  }

  return (
    <div className="collection-management">
      <div className="page-header">
        <h2>Collection Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <i className="fas fa-plus"></i> Add Collection
        </button>
      </div>

      <div className="collections-table">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Name</th>
              <th>Type</th>
              <th>Products</th>
              <th>Navbar</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.length > 0 ? (
              collections.map((collection, index) => (
                <tr key={collection._id} className={collection.isActive ? '' : 'inactive'}>
                  <td>{collection.order}</td>
                  <td>
                    <div className="collection-info">
                      <strong>{collection.name}</strong>
                      {collection.description && (
                        <small>{collection.description}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${collection.collectionType}`}>
                      {collection.collectionType}
                    </span>
                  </td>
                  <td>{collection.productCount || 0}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={collection.showInNavbar}
                      onChange={() => toggleNavbarVisibility(collection)}
                    />
                  </td>
                  <td>
                    <span className={`status-badge ${collection.isActive ? 'active' : 'inactive'}`}>
                      {collection.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleEdit(collection)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => toggleActiveStatus(collection)}
                    >
                      <i className={`fas ${collection.isActive ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(collection._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-collections">
                  <div className="no-collections-message">
                    <i className="fas fa-folder"></i>
                    <p>No collections found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Collection Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content collection-form">
            <div className="modal-header">
              <h3>{selectedCollection ? 'Edit Collection' : 'Add New Collection'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="collection-form-content">
              <div className="form-sections">
                {/* Basic Information */}
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Collection Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Collection Type</label>
                      <select
                        name="collectionType"
                        value={formData.collectionType}
                        onChange={handleInputChange}
                      >
                        <option value="main">Main Collection</option>
                        <option value="sub">Sub Collection</option>
                        <option value="seasonal">Seasonal Collection</option>
                        <option value="category">Category</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Display Order</label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-section">
                  <h4>Description</h4>
                  <div className="form-group">
                    <label>Collection Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Describe your collection..."
                    ></textarea>
                  </div>
                </div>

                {/* Display Options */}
                <div className="form-section">
                  <h4>Display Options</h4>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="showInNavbar"
                        checked={formData.showInNavbar}
                        onChange={handleInputChange}
                      />
                      Show in Navigation Bar
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="showInFeatured"
                        checked={formData.showInFeatured}
                        onChange={handleInputChange}
                      />
                      Show in Featured Section
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="showOnHome"
                        checked={formData.showOnHome}
                        onChange={handleInputChange}
                      />
                      Show on Home Page
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                      />
                      Active
                    </label>
                  </div>
                </div>

                {/* SEO */}
                <div className="form-section">
                  <h4>SEO Settings</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Meta Title</label>
                      <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        placeholder="SEO title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Meta Description</label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="SEO description"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="form-section">
                  <h4>Collection Image</h4>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="form-section">
                  <h4>Tags</h4>
                  <div className="form-group">
                    <label>Collection Tags</label>
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionManagement;
