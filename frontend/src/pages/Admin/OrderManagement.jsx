import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/admin/all');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const filteredOrders = filter === 'all' 
    ? (orders || []) 
    : (orders || []).filter(order => order.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'processing': return 'processing';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h2>Order Management</h2>
        <div className="order-filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="order-id">#{order._id?.slice(-8)}</span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.user?.name || 'N/A'}</span>
                      <span className="customer-email">{order.user?.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="item-count">{order.items?.length || 0} items</span>
                  </td>
                  <td className="order-total">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleViewOrder(order)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
            ))) : (
              <tr>
                <td colSpan="7" className="no-orders">
                  <div className="no-orders-message">
                    <i className="fas fa-shopping-cart"></i>
                    <p>No orders found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal">
          <div className="modal-content order-details">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="order-info">
              <div className="order-header">
                <div className="order-id-section">
                  <h4>Order #{selectedOrder._id?.slice(-8)}</h4>
                  <span className={`status-badge ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
                <div className="order-date">
                  <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="customer-details">
                <h5>Customer Information</h5>
                <div className="customer-grid">
                  <div>
                    <strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}
                  </div>
                </div>
                
                <h5>Shipping Address</h5>
                <div className="address">
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              <div className="order-items">
                <h5>Order Items</h5>
                <div className="items-list">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]?.url} alt={item.product?.name} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h6>{item.product?.name || 'Product'}</h6>
                        <p>Size: {item.size || 'N/A'}</p>
                        <p>Color: {item.color || 'N/A'}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        <p>₹{item.price || 0}</p>
                        <p>Total: ₹{(item.price || 0) * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal || 0}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.shippingCost || 0}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{selectedOrder.tax || 0}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{selectedOrder.totalAmount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
