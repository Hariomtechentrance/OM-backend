import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './AdminDashboard.css'; // Import admin dashboard styles
import api from '../../api/axios'; // Import API instance

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u._id === userId);
      await api.put(`/users/${userId}`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h2>User Management</h2>
        <div className="user-stats">
          <span>Total Users: {users.length}</span>
          <span>Active: {users.filter(u => u.isActive).length}</span>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.avatar ? (
                        <img src={user.avatar.url} alt={user.name} />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.phone || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleModal(true);
                      }}
                    >
                      <i className="fas fa-user-tag"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                      onClick={() => handleToggleUserStatus(user._id)}
                    >
                      <i className={`fas ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change User Role</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="user-avatar">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar.url} alt={selectedUser.name} />
                  ) : (
                    <i className="fas fa-user"></i>
                  )}
                </div>
                <div className="user-info">
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                  <p>Current Role: <span className="current-role">{selectedUser.role}</span></p>
                </div>
              </div>
              
              <div className="role-options">
                <h5>Select New Role:</h5>
                <div className="role-buttons">
                  <button
                    className={`role-btn ${selectedUser.role === 'user' ? 'active' : ''}`}
                    onClick={() => handleRoleChange(selectedUser._id, 'user')}
                  >
                    <i className="fas fa-user"></i>
                    <span>User</span>
                    <p>Can browse and purchase products</p>
                  </button>
                  <button
                    className={`role-btn ${selectedUser.role === 'admin' ? 'active' : ''}`}
                    onClick={() => handleRoleChange(selectedUser._id, 'admin')}
                  >
                    <i className="fas fa-user-shield"></i>
                    <span>Admin</span>
                    <p>Full access to admin features</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
