import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaLayerGroup, FaBox, FaTags, FaChartLine, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]); // Initialize as empty array
  const [stats, setStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    totalProducts: 0,
    avgProductsPerCategory: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'category' or 'collection'
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    bannerImage: '',
    parentCategory: '',
    order: 0,
    isActive: true,
    featured: false,
    type: 'category',
    showInNavbar: false,
    metaTitle: '',
    metaDescription: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [bannerImageUploading, setBannerImageUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    
    // Initialize default collections if they don't exist
    initializeDefaultCollections();
  }, []);

  const initializeDefaultCollections = () => {
    const existingCollections = JSON.parse(localStorage.getItem('collections') || '[]');
    
    // Only add defaults if no collections exist
    if (existingCollections.length === 0) {
      const defaultCollections = [
        {
          _id: 'default-1',
          name: 'Party Wear',
          slug: 'party-wear',
          icon: '🎉',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Special occasion wear for parties and events',
          productCount: 45
        },
        {
          _id: 'default-2',
          name: 'Casual',
          slug: 'casual',
          icon: '👕',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Comfortable everyday casual wear',
          productCount: 62
        },
        {
          _id: 'default-3',
          name: 'Polo T-shirts',
          slug: 'polo-tshirts',
          icon: '👔',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Classic polo t-shirts for all occasions',
          productCount: 28
        },
        {
          _id: 'default-4',
          name: 'New Collection',
          slug: 'new-collection',
          icon: '✨',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Latest arrivals and new designs',
          productCount: 33
        },
        {
          _id: 'default-5',
          name: 'Striped Collections',
          slug: 'striped-collection',
          icon: '📦',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Stylish striped patterns and designs',
          productCount: 51
        },
        {
          _id: 'default-6',
          name: 'Cargo Collection',
          slug: 'cargo-collection',
          icon: '🎒',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Functional cargo wear with utility',
          productCount: 19
        },
        {
          _id: 'default-7',
          name: 'Trousers Collection',
          slug: 'trousers-collection',
          icon: '👖',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Professional and casual trousers',
          productCount: 44
        },
        {
          _id: 'default-8',
          name: 'Denim Collection',
          slug: 'denim-collection',
          icon: '👖',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Classic denim jeans and jackets',
          productCount: 37
        },
        {
          _id: 'default-9',
          name: 'Winter Collection',
          slug: 'winter-collection',
          icon: '❄️',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Warm and cozy winter wear',
          productCount: 29
        },
        {
          _id: 'default-10',
          name: 'Formal Pants',
          slug: 'formal-pants',
          icon: '👔',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Professional formal pants for work',
          productCount: 23
        },
        {
          _id: 'default-11',
          name: 'Summer Final',
          slug: 'summer-final',
          icon: '☀️',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Light and breezy summer collection',
          productCount: 31
        },
        {
          _id: 'default-12',
          name: 'Office Collections',
          slug: 'office-collection',
          icon: '💼',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Professional office wear',
          productCount: 26
        },
        {
          _id: 'default-13',
          name: 'Checked Collections',
          slug: 'checked-collection',
          icon: '🏁',
          type: 'collection',
          isActive: true,
          showInNavbar: true,
          description: 'Classic checked patterns and designs',
          productCount: 18
        }
      ];
      
      localStorage.setItem('collections', JSON.stringify(defaultCollections));
      console.log('Default collections initialized:', defaultCollections);
      
      // Update the categories state to show these in admin panel
      setCategories(prev => [...prev, ...defaultCollections]);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Get collections from localStorage (including default ones)
      const localCollections = JSON.parse(localStorage.getItem('collections') || '[]');
      
      // For now, use mock data for categories + real collections from localStorage
      const mockCategories = [
        { _id: 'cat1', name: 'Men\'s Clothing', description: 'Clothing for men', isActive: true, type: 'category', order: 0, productCount: 45 },
        { _id: 'cat2', name: 'Women\'s Clothing', description: 'Clothing for women', isActive: true, type: 'category', order: 1, productCount: 62 },
        { _id: 'cat3', name: 'Accessories', description: 'Fashion accessories', isActive: true, type: 'category', order: 2, productCount: 28 },
        { _id: 'cat4', name: 'Footwear', description: 'Shoes and sandals', isActive: false, type: 'category', order: 3, productCount: 33 },
        { _id: 'cat5', name: 'Kids Collection', description: 'Clothing for kids', isActive: true, type: 'category', order: 4, productCount: 51 }
      ];
      
      // Combine categories and collections (both default and admin-created)
      const allItems = [...mockCategories, ...localCollections];
      setCategories(allItems);
      
      // Calculate stats
      const activeCategories = allItems.filter(item => item.type === 'category' && item.isActive).length;
      const activeCollections = allItems.filter(item => item.type === 'collection' && item.isActive).length;
      const totalProducts = allItems.reduce((sum, item) => sum + (item.productCount || 0), 0);
      
      setStats({
        totalCategories: activeCategories,
        totalCollections: activeCollections,
        totalProducts: totalProducts,
        activeItems: allItems.filter(item => item.isActive).length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    console.log('Form data before validation:', formData);
    console.log('Name value:', formData.name);
    console.log('Name type:', typeof formData.name);
    console.log('Image value:', formData.image);
    console.log('Image type:', typeof formData.image);
    
    if (!formData.name || (typeof formData.name !== 'string') || formData.name.trim() === '') {
      toast.error('Category/Collection name is required');
      console.log('Name validation failed');
      return;
    }

    if (!formData.image || (typeof formData.image !== 'string') || formData.image.trim() === '') {
      toast.error('Category image is required. Please upload an image.');
      console.log('Image validation failed');
      return;
    }
    
    console.log('Submitting form data:', formData);
    console.log('Modal type:', modalType);
    console.log('Form type field:', formData.type);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      // Fetch categories with statistics
      const response = await fetch('/api/dashboard/categories-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories || []); // Ensure it's always an array
        
        // Set stats from API response
        if (data.data.stats) {
          setStats({
            totalCategories: data.data.stats.totalCategories,
            activeCategories: data.data.stats.activeCategories,
            totalProducts: data.data.stats.totalProducts,
            avgProductsPerCategory: data.data.stats.avgProductsPerCategory
          });
        }
      } else {
        console.error('Failed to fetch categories:', data.message);
        setCategories([]); // Fallback to empty array
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      // For now, simulate deletion with mock data
      // TODO: Uncomment below when backend is ready
      /*
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      */
      
      // Mock successful deletion
      const mockData = { success: true };
      
      if (mockData.success) {
        toast.success('Category deleted successfully');
        
        // Remove from local categories
        const deletedCategory = categories.find(cat => cat._id === categoryId);
        setCategories(categories.filter(cat => cat._id !== categoryId));
        
        // Update stats
        const totalCategories = categories.length - 1;
        const activeCategories = categories.filter(cat => cat.isActive && cat._id !== categoryId).length;
        const totalProducts = categories.reduce((sum, cat) => 
          cat._id !== categoryId ? sum + (cat.productCount || 0) : sum, 0
        );
        const avgProductsPerCategory = totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0;
        
        setStats({
          totalCategories,
          activeCategories,
          totalProducts,
          avgProductsPerCategory
        });
      } else {
        toast.error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      bannerImage: category.bannerImage || '',
      parentCategory: category.parentCategory?._id || '',
      order: category.order || 0,
      isActive: category.isActive,
      featured: category.featured,
      type: category.type || 'category',
      showInNavbar: category.showInNavbar || false,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      tags: category.tags || []
    });
    setModalType(category.type || 'category');
    setShowModal(true);
  };

  const resetForm = (type = 'category') => {
    setFormData({
      name: '',
      description: '',
      image: '',
      bannerImage: '',
      parentCategory: '',
      order: 0,
      isActive: true,
      featured: false,
      type: type, // Explicitly set the type
      showInNavbar: false,
      metaTitle: '',
      metaDescription: '',
      tags: []
    });
    setEditingCategory(null);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    try {
      if (type === 'category') {
        setImageUploading(true);
      } else {
        setBannerImageUploading(true);
      }

      // For now, simulate image upload with mock data
      // TODO: Uncomment below when backend is ready
      /*
      const token = localStorage.getItem('adminToken');
      console.log('Token from localStorage:', token); // Debug log
      
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      uploadFormData.append('type', type);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      console.log('Upload response status:', response.status); // Debug log
      const data = await response.json();
      console.log('Upload response data:', data); // Debug log
      */
      
      // Mock successful upload
      setTimeout(() => {
        const mockData = {
          success: true,
          url: URL.createObjectURL(file) // Create temporary URL for demo
        };
        
        if (mockData.success) {
          if (type === 'category') {
            setFormData({
              ...formData,
              image: mockData.url
            });
          } else {
            setFormData({
              ...formData,
              bannerImage: mockData.url
            });
          }
          toast.success('Image uploaded successfully');
        } else {
          toast.error('Image upload failed');
        }
        
        setImageUploading(false);
        setBannerImageUploading(false);
      }, 1000); // Simulate upload delay
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed: ' + (error.message || 'Network error'));
      setImageUploading(false);
      setBannerImageUploading(false);
    }
  };

  const handleReorder = async (reorderedCategories) => {
    if (!reorderedCategories || !Array.isArray(reorderedCategories)) {
      console.error('Invalid reorderedCategories:', reorderedCategories);
      return;
    }
    
    try {
      const response = await fetch('/api/categories/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          categories: reorderedCategories.map((cat, index) => ({
            id: cat._id,
            order: index
          }))
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Categories reordered successfully');
        fetchCategories();
      } else {
        toast.error('Reorder failed');
      }
    } catch (error) {
      toast.error('Reorder failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  // Debug: Log categories state
  console.log('Categories state:', categories);

  return (
    <div className="category-management">
      {/* Categories Stats Section */}
      <div className="stats-grid">
        <div className="stat-card premium-card">
          <div className="stat-icon categories">
            <FaLayerGroup />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCategories}</h3>
            <p>Total Categories</p>
            <span className="stat-change positive">+5%</span>
          </div>
        </div>

        <div className="stat-card premium-card">
          <div className="stat-icon active">
            <FaTags />
          </div>
          <div className="stat-info">
            <h3>{stats.activeCategories}</h3>
            <p>Active Categories</p>
            <span className="stat-change positive">+2%</span>
          </div>
        </div>

        <div className="stat-card premium-card">
          <div className="stat-icon products">
            <FaBox />
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
            <span className="stat-change positive">+18%</span>
          </div>
        </div>

        <div className="stat-card premium-card">
          <div className="stat-icon average">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>{stats.avgProductsPerCategory}</h3>
            <p>Avg Products/Category</p>
            <span className="stat-change positive">+7%</span>
          </div>
        </div>
      </div>

      {/* Categories Management Section */}
      <div className="content-card">
        <div className="content-section-header">
          <h2 className="content-section-title">Categories Management</h2>
          <div className="content-actions">
            <button 
              className="btn-primary"
              onClick={() => {
                setModalType('category');
                resetForm('category');
                setShowModal(true);
              }}
            >
              <FaPlus />
              Add New Category
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                setModalType('collection');
                resetForm('collection');
                setShowModal(true);
              }}
            >
              <FaPlus />
              Add New Collection
            </button>
          </div>
        </div>

        <div className="categories-grid">
          {categories?.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-actions">
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(category)}
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(category._id)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-meta">
                  <span className={`status ${category.isActive ? 'active' : 'inactive'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {category.featured && <span className="featured">Featured</span>}
                  <span className="type">{category.type === 'category' ? 'Category' : 'Collection'}</span>
                  {category.showInNavbar && <span className="navbar">Navbar</span>}
                  <span className="order">Order: {category.order}</span>
                </div>
                {category.parentCategory && (
                  <div className="parent-category">
                    Parent: {category.parentCategory.name}
                  </div>
                )}
                {category.tags?.length > 0 && (
                  <div className="tags">
                    {category.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? `Edit ${modalType === 'category' ? 'Category' : 'Collection'}` : `Add New ${modalType === 'category' ? 'Category' : 'Collection'}`}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="category">Category</option>
                    <option value="collection">Collection</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category Image *</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'category')}
                      style={{ display: 'none' }}
                      id="category-image-upload"
                    />
                    <label htmlFor="category-image-upload" className="file-upload-label">
                      {imageUploading ? (
                        <div className="uploading">
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="upload-preview">
                          {formData.image ? (
                            <img src={formData.image} alt="Category" />
                          ) : (
                            <div className="upload-placeholder">
                              <span>📁</span>
                              <span>Click to upload image</span>
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Banner Image</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'banner')}
                      style={{ display: 'none' }}
                      id="banner-image-upload"
                    />
                    <label htmlFor="banner-image-upload" className="file-upload-label">
                      {bannerImageUploading ? (
                        <div className="uploading">
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="upload-preview">
                          {formData.bannerImage ? (
                            <img src={formData.bannerImage} alt="Banner" />
                          ) : (
                            <div className="upload-placeholder">
                              <span>📁</span>
                              <span>Click to upload banner</span>
                            </div>
                          )}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Parent Category</label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({...formData, parentCategory: e.target.value})}
                >
                  <option value="">None (Root Category)</option>
                  {categories?.filter(cat => !cat.parentCategory).map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Show in Navigation Bar</label>
                  <select
                    value={formData.showInNavbar}
                    onChange={(e) => setFormData({...formData, showInNavbar: e.target.value === 'true'})}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Meta Description</label>
                  <input
                    type="text"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tag-input">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button type="button" onClick={handleAddTag}>Add</button>
                </div>
                <div className="tags-list">
                  {formData.tags?.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    Featured
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? `Update ${modalType === 'category' ? 'Category' : 'Collection'}` : `Create ${modalType === 'category' ? 'Category' : 'Collection'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
