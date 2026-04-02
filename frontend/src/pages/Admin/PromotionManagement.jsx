import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage', // percentage or fixed
    discountValue: '',
    minimumAmount: '',
    startDate: '',
    endDate: '',
    isActive: true,
    maxUses: '',
    usedCount: 0,
    applicableProducts: [],
    applicableCategories: []
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      // Since there's no promotion API in the backend, I'll simulate it
      // In a real application, this would call an API endpoint
      const mockPromotions = [
        {
          _id: '1',
          name: 'Summer Sale',
          code: 'SUMMER20',
          type: 'percentage',
          discountValue: 20,
          minimumAmount: 100,
          startDate: '2023-06-01',
          endDate: '2023-08-31',
          isActive: true,
          maxUses: 100,
          usedCount: 45,
          createdAt: new Date().toISOString(),
        }
      ];
      setPromotions(mockPromotions);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch promotions');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promotionData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minimumAmount: parseFloat(formData.minimumAmount),
        maxUses: parseInt(formData.maxUses) || 0
      };

      if (selectedPromotion) {
        // Update promotion (mock)
        setPromotions(prev => prev.map(p => 
          p._id === selectedPromotion._id ? { ...promotionData, _id: selectedPromotion._id } : p
        ));
        toast.success('Promotion updated successfully');
      } else {
        // Add promotion (mock)
        const newPromotion = {
          ...promotionData,
          _id: Date.now().toString(),
          usedCount: 0,
          createdAt: new Date().toISOString()
        };
        setPromotions(prev => [...prev, newPromotion]);
        toast.success('Promotion added successfully');
      }

      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save promotion');
    }
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.name || '',
      code: promotion.code || '',
      type: promotion.type || 'percentage',
      discountValue: promotion.discountValue || '',
      minimumAmount: promotion.minimumAmount || '',
      startDate: promotion.startDate || '',
      endDate: promotion.endDate || '',
      isActive: promotion.isActive || false,
      maxUses: promotion.maxUses || '',
      usedCount: promotion.usedCount || 0,
      applicableProducts: promotion.applicableProducts || [],
      applicableCategories: promotion.applicableCategories || []
    });
    setShowEditModal(true);
  };

  const handleDelete = async (promotionId) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        setPromotions(prev => prev.filter(p => p._id !== promotionId));
        toast.success('Promotion deleted successfully');
      } catch (error) {
        toast.error('Failed to delete promotion');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'percentage',
      discountValue: '',
      minimumAmount: '',
      startDate: '',
      endDate: '',
      isActive: true,
      maxUses: '',
      usedCount: 0,
      applicableProducts: [],
      applicableCategories: []
    });
    setSelectedPromotion(null);
  };

  if (loading) {
    return <div className="loading">Loading promotions...</div>;
  }

  return (
    <div className="promotion-management">
      <div className="page-header">
        <h2>Promotion Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <i className="fas fa-percentage"></i> Add Promotion
        </button>
      </div>

      <div className="promotions-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Dates</th>
              <th>Min Amount</th>
              <th>Uses</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length > 0 ? (
              promotions.map((promotion) => (
                <tr key={promotion._id}>
                  <td>{promotion.name}</td>
                  <td><code>{promotion.code}</code></td>
                  <td>
                    <span className={`badge ${promotion.type}`}>
                      {promotion.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                  </td>
                  <td>
                    {promotion.type === 'percentage' 
                      ? `${promotion.discountValue}%` 
                      : `₹${promotion.discountValue}`}
                  </td>
                  <td>
                    {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                  </td>
                  <td>₹{promotion.minimumAmount || 0}</td>
                  <td>
                    {promotion.usedCount || 0}/{promotion.maxUses || '∞'}
                  </td>
                  <td>
                    <span className={`status-badge ${promotion.isActive ? 'active' : 'inactive'}`}>
                      {promotion.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(promotion)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(promotion._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-promotions">
                  <div className="no-promotions-message">
                    <i className="fas fa-percentage"></i>
                    <p>No promotions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Promotion Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content promotion-form">
            <div className="modal-header">
              <h3>{selectedPromotion ? 'Edit Promotion' : 'Add New Promotion'}</h3>
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

            <form onSubmit={handleSubmit} className="promotion-form-content">
              <div className="form-sections">
                {/* Basic Information */}
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Promotion Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Promotion Code *</label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="e.g., SUMMER20"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Type *</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="percentage">Percentage Discount</option>
                        <option value="fixed">Fixed Amount Discount</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Discount Value *</label>
                      <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleInputChange}
                        step={formData.type === 'percentage' ? '0.01' : '1'}
                        min="0"
                        required
                      />
                      <small>
                        {formData.type === 'percentage' ? '%' : '₹'} off
                      </small>
                    </div>
                  </div>
                </div>

                {/* Dates and Limits */}
                <div className="form-section">
                  <h4>Dates and Limits</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Minimum Order Amount</label>
                      <input
                        type="number"
                        name="minimumAmount"
                        value={formData.minimumAmount}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0 for no minimum"
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Uses</label>
                      <input
                        type="number"
                        name="maxUses"
                        value={formData.maxUses}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0 for unlimited"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        Active Promotion
                      </label>
                    </div>
                  </div>
                </div>

                {/* Applicable Products/Categories */}
                <div className="form-section">
                  <h4>Applicability</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Applicable Products (comma separated IDs)</label>
                      <input
                        type="text"
                        placeholder="Leave empty for all products"
                      />
                    </div>
                    <div className="form-group">
                      <label>Applicable Categories (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Leave empty for all categories"
                      />
                    </div>
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
                  {selectedPromotion ? 'Update Promotion' : 'Add Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManagement;