import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaTimes, FaCheck, FaMobileAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import OTPLogin from '../components/Auth/OTPLogin';
import logo from '../assets/images/new-logo.png';
import { API_BASE } from '../config/api';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [showSocialLogin, setShowSocialLogin] = useState(false);
  const [socialLoginMethod, setSocialLoginMethod] = useState('');
  const [showOTPLogin, setShowOTPLogin] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); // ✅ FIX: Add local loading state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const { login, loading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      user &&
      window.location.pathname === '/login'
    ) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [loading, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Facebook') {
      toast.info('Facebook login is temporarily unavailable. Please use email login.');
      return;
    }
    
    if (provider === 'Google') {
      toast.info('Google login is being updated. Please use email login for now.');
      return;
    }
    
    // For future social login implementations
    toast.info(`${provider} login will be available soon.`);
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      // Simulate OTP verification
      toast.success('OTP verified successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      // Simulate sending OTP
      toast.success('OTP sent to your email!');
      setShowOtp(true);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 MUST
    
    try {
      console.log("🔥 FORM SUBMITTED", e);
      console.log("🔥 formData:", formData);
      
      // ✅ Use AuthContext login function instead of direct API call
      const result = await login(formData);
      
      console.log("LOGIN RESULT:", result);

      if (result.success) {
        toast.success('Login successful!');
        
        // ✅ REDIRECT based on role
        const role = result.user?.role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      toast.error(err.message || 'Login failed');
    }
  };

  const handleOtpLoginSuccess = (userData) => {
    toast.success('OTP Login successful!');
    const role = userData?.role;
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleOtpChange = (value) => {
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleOtpKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleOtpLogin(e);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo-section">
          <img src={logo} alt="Black Locust" className="login-logo" />
        </div>
        
        <div className="login-form-wrapper">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Login to your account</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me-checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" name="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-submit-btn" disabled={localLoading}>
              {localLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="social-login-section">
            <div className="login-divider"><span>OR</span></div>
            <div className="social-login-buttons">
              <button type="button" className="social-login-btn google-login" onClick={() => handleSocialLogin('Google')}>
                <FaGoogle /><span>Continue with Google</span>
              </button>
              <button type="button" className="social-login-btn facebook-login" onClick={() => handleSocialLogin('Facebook')}>
                <FaFacebook /><span>Continue with Facebook</span>
              </button>
            </div>
          </div>

          <div className="otp-login-link">
            <button type="button" onClick={() => setShowOTPLogin(true)}>
              <FaMobileAlt /> Login with OTP
            </button>
          </div>

          <div className="register-redirect">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>
        </div>
      </div>

      {showOTPLogin && (
        <OTPLogin
          onBack={() => setShowOTPLogin(false)}
          onClose={() => setShowOTPLogin(false)}
          onOTPLoginSuccess={handleOtpLoginSuccess}
        />
      )}
    </div>
  );
};

export default LoginPage;
