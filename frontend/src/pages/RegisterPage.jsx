import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/new-logo.png';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [showSocialLogin, setShowSocialLogin] = useState(false);
  const [socialLoginMethod, setSocialLoginMethod] = useState('');

  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      toast.error(error);
      clearError();
    }
  }, [isAuthenticated, error, navigate, clearError]);

  const { name, email, password, confirmPassword, phone } = formData;

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Facebook') {
      toast.info('Facebook registration is temporarily unavailable. Please use email registration.');
      return;
    }
    
    if (provider === 'Google') {
      toast.info('Google registration is being updated. Please use email registration for now.');
      return;
    }
    
    // For future social login implementations
    toast.info(`${provider} registration will be available soon.`);
  };

  const handleOtpRegistration = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      // Simulate OTP verification and registration
      toast.success('OTP verified! Registration successful!');
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
    
    if (!formData.name) {
      toast.error('Please enter your name');
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

  const handleOtpChange = (value) => {
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleOtpKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleOtpRegistration(e);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate terms checkbox
    if (!formData.terms) {
      toast.error('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register({
      name,
      email,
      password,
      phone
    });
    
    if (result.success) {
      toast.success('Registration successful!');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo-section">
          <img src={logo} alt="Black Locust" className="register-logo" />
        </div>
        
        <div className="register-form-wrapper">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join Black Locust and start your fashion journey</p>

          <form onSubmit={onSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={name} onChange={onChange} required placeholder="Enter your full name" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" value={email} onChange={onChange} required placeholder="Enter your email" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} onChange={onChange} required placeholder="Create a password" />
                <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('password')}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={onChange} required placeholder="Confirm your password" />
                <button type="button" className="password-toggle-btn" onClick={() => togglePasswordVisibility('confirmPassword')}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>

            <div className="terms-agreement-section">
              <label className="checkbox-label-wrapper">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={onChange} required />
                <span>I agree to the <Link to="/terms" className="terms-link-text">Terms of Service</Link> and <Link to="/privacy" className="terms-link-text">Privacy Policy</Link></span>
              </label>
            </div>

            <button type="submit" className="register-submit-btn" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>

          <div className="social-register-section">
            <div className="register-divider"><span>OR</span></div>
            <div className="social-register-buttons">
              <button type="button" className="social-register-btn google-register" onClick={() => handleSocialLogin('Google')}><FaGoogle /><span>Sign up with Google</span></button>
              <button type="button" className="social-register-btn facebook-register" onClick={() => handleSocialLogin('Facebook')}><FaFacebook /><span>Sign up with Facebook</span></button>
            </div>
          </div>

          <div className="login-redirect-section">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
