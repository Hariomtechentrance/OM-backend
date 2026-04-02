import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaSignOutAlt, FaHistory, FaCog, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [activeTab, setActiveTab] = useState('orders');
  const [orderHistory, setOrderHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    // Load order history from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    setOrderHistory(savedOrders);

    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);

    // Load addresses from localStorage
    const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    setAddresses(savedAddresses);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleAddAddress = () => {
    const newAddress = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
    localStorage.setItem('addresses', JSON.stringify([...addresses, newAddress]));
  };

  const handleRemoveAddress = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
  };

  const handleSetDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="auth-required">
            <h2>Please Login to View Profile</h2>
            <p>You need to be logged in to access your profile page.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h2>{user?.name || 'User'}</h2>
              <p>{user?.email || 'user@example.com'}</p>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="sidebar-menu">
              <button 
                className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FaHistory /> Order History
              </button>
              <button 
                className={`sidebar-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <FaHeart /> Wishlist
              </button>
              <button 
                className={`sidebar-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <FaMapMarkerAlt /> Addresses
              </button>
              <button 
                className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <FaCog /> Settings
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === 'orders' && (
              <div className="tab-content">
                <h3>Order History</h3>
                {orderHistory.length === 0 ? (
                  <p className="no-data">No orders yet</p>
                ) : (
                  <div className="order-list">
                    {orderHistory.map(order => (
                      <div key={order.id} className="order-item">
                        <div className="order-header">
                          <span className="order-id">Order #{order.id}</span>
                          <span className="order-date">{order.date}</span>
                          <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                        </div>
                        <div className="order-items">
                          {order.items.map(item => (
                            <div key={item.id} className="order-product">
                              <img src={item.image} alt={item.name} />
                              <div className="order-product-info">
                                <h4>{item.name}</h4>
                                <p>Size: {item.size || 'N/A'}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p className="order-price">₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-total">
                          <span>Total: ₹{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="tab-content">
                <h3>My Wishlist</h3>
                {wishlist.length === 0 ? (
                  <p className="no-data">No items in wishlist</p>
                ) : (
                  <div className="wishlist-grid">
                    {wishlist.map(item => (
                      <div key={item.id} className="wishlist-item">
                        <img src={item.image} alt={item.name} />
                        <div className="wishlist-item-info">
                          <h4>{item.name}</h4>
                          <p className="wishlist-price">₹{item.price}</p>
                          <button 
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="remove-wishlist-btn"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="tab-content">
                <h3>Shipping Addresses</h3>
                <button onClick={handleAddAddress} className="add-address-btn">
                  + Add New Address
                </button>
                {addresses.length === 0 ? (
                  <p className="no-data">No addresses saved</p>
                ) : (
                  <div className="address-list">
                    {addresses.map(address => (
                      <div key={address.id} className={`address-item ${address.isDefault ? 'default' : ''}`}>
                        <div className="address-header">
                          <h4>{address.name || 'Home Address'}</h4>
                          {address.isDefault && <span className="default-badge">Default</span>}
                          <button 
                            onClick={() => handleRemoveAddress(address.id)}
                            className="remove-address-btn"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="address-details">
                          <p><strong>Name:</strong> {address.name}</p>
                          <p><strong>Phone:</strong> {address.phone}</p>
                          <p><strong>Address:</strong> {address.address}</p>
                          <p><strong>City:</strong> {address.city}</p>
                          <p><strong>State:</strong> {address.state}</p>
                          <p><strong>ZIP Code:</strong> {address.zipCode}</p>
                          {!address.isDefault && (
                            <button 
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="set-default-btn"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="tab-content">
                <h3>Account Settings</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue={user?.name || ''} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={user?.email || ''} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" defaultValue={user?.phone || ''} />
                  </div>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Enter current password" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                  <button className="btn btn-primary">Update Settings</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
