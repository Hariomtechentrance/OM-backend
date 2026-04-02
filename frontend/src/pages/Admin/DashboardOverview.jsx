import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaUsers, FaShoppingBag, FaDollarSign, FaChartLine, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // For now, use mock data to ensure UI works
      // We'll implement real API calls after confirming UI is working
      const mockStats = {
        totalProducts: 156,
        totalUsers: 1248,
        totalOrders: 892,
        totalRevenue: 45678.90,
        recentOrders: [
          { _id: 'order12345678', user: { name: 'John Doe' }, createdAt: new Date(), totalAmount: 299.99, status: 'completed' },
          { _id: 'order87654321', user: { name: 'Jane Smith' }, createdAt: new Date(), totalAmount: 199.99, status: 'pending' },
          { _id: 'order11223344', user: { name: 'Bob Johnson' }, createdAt: new Date(), totalAmount: 149.99, status: 'completed' }
        ],
        topProducts: [
          { _id: 'prod1', name: 'Premium T-Shirt', price: 29.99, stock: 45, images: [], salesCount: 89 },
          { _id: 'prod2', name: 'Designer Jeans', price: 89.99, stock: 23, images: [], salesCount: 67 },
          { _id: 'prod3', name: 'Leather Wallet', price: 49.99, stock: 67, images: [], salesCount: 45 }
        ]
      };

      setStats(mockStats);
      setLoading(false);
      
      // TODO: Uncomment below when API is ready
      /*
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch real dashboard statistics
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats({
          totalProducts: data.data.totalProducts || 0,
          totalUsers: data.data.totalUsers || 0,
          totalOrders: data.data.totalOrders || 0,
          totalRevenue: data.data.totalRevenue || 0,
          recentOrders: data.data.recentOrders || [],
          topProducts: data.data.topProducts || []
        });
      } else {
        console.error('Failed to fetch dashboard stats:', data.message);
        // Fallback to mock data if API fails
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          recentOrders: [],
          topProducts: []
        });
      }
      */
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        topProducts: []
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-overview">
      {/* Dashboard Content Cards */}
      <div className="content-card">
        <div className="dashboard-header">
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Premium Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card premium-card">
            <div className="stat-icon products">
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
              <span className="stat-change positive">+12%</span>
            </div>
          </div>

          <div className="stat-card premium-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
              <span className="stat-change positive">+8%</span>
            </div>
          </div>

          <div className="stat-card premium-card">
            <div className="stat-icon orders">
              <FaShoppingBag />
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
              <span className="stat-change positive">+24%</span>
            </div>
          </div>

          <div className="stat-card premium-card">
            <div className="stat-icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-info">
              <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
              <span className="stat-change positive">+18%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <div className="dashboard-section">
            <h3>Recent Orders</h3>
            <div className="recent-orders">
              {stats.recentOrders.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id?.slice(-8)}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalAmount || 0}</td>
                        <td>
                          <span className={`status-badge ${order.status === 'completed' ? 'status-active' : order.status === 'pending' ? 'status-pending' : 'status-inactive'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent orders found.</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="dashboard-section">
            <h3>Top Products</h3>
            <div className="top-products">
              {stats.topProducts.length > 0 ? (
                <div className="product-list">
                  {stats.topProducts.map((product) => (
                    <div key={product._id} className="product-item">
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]?.url} alt={product.name} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="price">₹{product.price}</p>
                        <p className="stock">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No products available</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn">
                <i className="fas fa-plus"></i>
                Add Product
              </button>
              <button className="action-btn">
                <i className="fas fa-percentage"></i>
                Create Promotion
              </button>
              <button className="action-btn">
                <i className="fas fa-chart-bar"></i>
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
