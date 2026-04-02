import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaCog, FaTags, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import PromotionManagement from './PromotionManagement';
import CategoryManagement from './CategoryManagement';
import CollectionManagement from './CollectionManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      // Verify token with backend
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminTokenExpiry');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
    
    // ✅ FIXED: Use React Router navigation instead of forced reload
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <AdminSidebar sidebarOpen={sidebarOpen} />
      </div>
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <i className={`fas ${sidebarOpen ? 'fa-bars' : 'fa-bars'}`}></i>
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="admin-info">
              <div className="admin-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
              <span>Admin</span>
            </div>
            <div className="header-actions">
              <Link to="/" className="back-to-site">
                <i className="fas fa-home"></i>
                Back to Site
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/promotions" element={<PromotionManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/collections" element={<CollectionManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
