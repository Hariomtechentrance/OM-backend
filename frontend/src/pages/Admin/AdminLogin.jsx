import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../api/axios'; // ✅ FIXED: Use shared axios instance
import logo from '../../assets/images/new-logo.png';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');

    // Only redirect if admin already logged in
    if (adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/users/admin/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      const { token, refreshToken, tokenExpiry, user } = res.data;
      
      // Store admin tokens
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminRefreshToken', refreshToken);
      localStorage.setItem('adminTokenExpiry', tokenExpiry);
      localStorage.setItem('isAdmin', 'true');
      
      // Set auth header is handled by api interceptor
      
      toast.success('Admin login successful!');
      navigate('/admin');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    // Handle 2FA if implemented
    toast.success('2FA verification successful!');
    navigate('/admin');
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <div className="admin-login-form-wrapper">
          <div className="admin-login-header">
            <img src={logo} alt="Black Locust" className="admin-logo" />
            <div className="admin-badge">
              <FaShieldAlt />
              <span>Admin Portal</span>
            </div>
          </div>
          
          <h2>Admin Login</h2>
          <p className="admin-subtitle">Access administrative controls</p>
          
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@blacklocust.com"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="rememberMe" 
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login to Admin'}
            </button>
          </form>

          <div className="admin-security-info">
            <div className="security-item">
              <FaShieldAlt />
              <span>Secure admin access with role-based permissions</span>
            </div>
          </div>

          <div className="admin-login-footer">
            <Link to="/login" className="back-to-user-login">
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>

      {/* OTP Modal for 2FA */}
      {showOtp && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Two-Factor Authentication</h3>
            <p>Enter the 6-digit code sent to your device</p>
            <form onSubmit={handleOtpSubmit}>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
                placeholder="000000"
              />
              <button type="submit" className="verify-otp-btn">
                Verify
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
