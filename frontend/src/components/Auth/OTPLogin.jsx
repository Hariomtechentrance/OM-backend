import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMobileAlt, FaArrowLeft, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import emailOTPService from '../../services/EmailOTPService';
import './OTPLogin.css';

const OTPLogin = ({ onBack, onClose, onOTPLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSetupInfo, setShowSetupInfo] = useState(false);

  // Get setup instructions
  const setupInstructions = emailOTPService.getSetupInstructions();

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate mobile number
  const validateMobile = (mobile) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    const newErrors = {};
    
    if (loginMethod === 'email') {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!validateMobile(mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Generate OTP
      const generatedOTP = emailOTPService.generateOTP();
      
      if (loginMethod === 'email') {
        // Send OTP via email
        const response = await emailOTPService.sendOTP(email, generatedOTP);
        
        if (response.success) {
          setOtpSent(true);
          setTimer(60);
          setResendDisabled(true);
          
          if (response.demo) {
            toast.info(`Demo Mode: Check console for OTP (${generatedOTP})`);
          } else {
            toast.success('OTP sent to your email!');
          }
        } else {
          setErrors({ general: response.message });
        }
      } else {
        // For mobile, show demo message (SMS requires paid service)
        const response = await emailOTPService.sendOTP(`${mobile}@demo.sms`, generatedOTP);
        
        if (response.success) {
          setOtpSent(true);
          setTimer(60);
          setResendDisabled(true);
          toast.info(`Demo Mode: Mobile OTP (${generatedOTP}) - SMS requires paid service`);
        } else {
          setErrors({ general: response.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP key press
  const handleOTPKeyPress = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = async () => {
    const enteredOTP = otp.join('');
    
    if (enteredOTP.length !== 6) {
      setErrors({ otp: 'Please enter complete 6-digit OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Verify OTP using EmailOTPService
      const response = emailOTPService.verifyOTP(enteredOTP);
      
      if (response.success) {
        // Create user session
        const userData = {
          id: Date.now().toString(),
          name: loginMethod === 'email' ? email.split('@')[0] : `User ${mobile.slice(-4)}`,
          email: loginMethod === 'email' ? email : '',
          mobile: loginMethod === 'mobile' ? mobile : '',
          loginMethod: loginMethod,
          loginTime: new Date().toISOString()
        };
        
        // Store user session
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Login successful!');
        onOTPLoginSuccess(userData);
      } else {
        setErrors({ otp: response.message });
      }
    } catch (error) {
      setErrors({ general: 'OTP verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Generate new OTP
      const generatedOTP = emailOTPService.generateOTP();
      
      if (loginMethod === 'email') {
        const response = await emailOTPService.sendOTP(email, generatedOTP);
        
        if (response.success) {
          setTimer(60);
          setResendDisabled(true);
          setOtp(['', '', '', '', '', '']);
          
          if (response.demo) {
            toast.info(`New OTP sent! Check console (${generatedOTP})`);
          } else {
            toast.success('New OTP sent to your email!');
          }
        } else {
          setErrors({ general: response.message });
        }
      } else {
        const response = await emailOTPService.sendOTP(`${mobile}@demo.sms`, generatedOTP);
        
        if (response.success) {
          setTimer(60);
          setResendDisabled(true);
          setOtp(['', '', '', '', '', '']);
          toast.info(`New OTP sent! Check console (${generatedOTP})`);
        } else {
          setErrors({ general: response.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'Failed to resend OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle back to login method selection
  const handleBack = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setResendDisabled(true);
    setErrors({});
  };

  return (
    <div className="otp-login-overlay">
      <div className="otp-login-modal">
        <div className="otp-login-header">
          <button className="back-btn" onClick={onBack}>
            <FaArrowLeft />
          </button>
          <h2>Login with OTP</h2>
          <div className="header-buttons">
            <button 
              className="info-btn" 
              onClick={() => setShowSetupInfo(!showSetupInfo)}
              title="Setup Instructions"
            >
              <FaInfoCircle />
            </button>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {!otpSent ? (
          <div className="otp-login-form">
            <div className="login-method-selector">
              <button
                className={`method-btn ${loginMethod === 'email' ? 'active' : ''}`}
                onClick={() => setLoginMethod('email')}
              >
                <FaEnvelope />
                <span>Email</span>
              </button>
              <button
                className={`method-btn ${loginMethod === 'mobile' ? 'active' : ''}`}
                onClick={() => setLoginMethod('mobile')}
              >
                <FaMobileAlt />
                <span>Mobile</span>
              </button>
            </div>

            <div className="input-group">
              {loginMethod === 'email' ? (
                <>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </>
              ) : (
                <>
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter your 10-digit mobile number"
                    className={errors.mobile ? 'error' : ''}
                  />
                  {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                </>
              )}
            </div>

            {errors.general && <div className="error-message general">{errors.general}</div>}

            <button
              className="send-otp-btn"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="otp-verification-form">
            <div className="otp-info">
              <p>
                We've sent a 6-digit OTP to your {loginMethod === 'email' ? 'email' : 'mobile number'}
              </p>
              <p className="otp-value">
                {loginMethod === 'email' ? email : `+91 ${mobile}`}
              </p>
            </div>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyPress(e, index)}
                  className={errors.otp ? 'error' : ''}
                />
              ))}
            </div>

            {errors.otp && <span className="error-message">{errors.otp}</span>}
            {errors.general && <div className="error-message general">{errors.general}</div>}

            <div className="otp-actions">
              <button
                className="verify-otp-btn"
                onClick={handleVerifyOTP}
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="resend-section">
                <span>Didn't receive OTP?</span>
                <button
                  className="resend-otp-btn"
                  onClick={handleResendOTP}
                  disabled={resendDisabled || loading}
                >
                  {resendDisabled ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
              </div>

              <button className="change-number-btn" onClick={handleBack}>
                Change {loginMethod === 'email' ? 'Email' : 'Mobile Number'}
              </button>
            </div>
          </div>
        )}
        
        {/* Setup Info Section */}
        {showSetupInfo && (
          <div className="setup-info-section">
            <div className="setup-info-content">
              <h3>{setupInstructions.title}</h3>
              <div className="setup-steps">
                {setupInstructions.steps.map((step, index) => (
                  <div key={index} className="setup-step">
                    <span className="step-number">{index + 1}</span>
                    <span className="step-text">{step}</span>
                  </div>
                ))}
              </div>
              <div className="template-example">
                <h4>Email Template Example:</h4>
                <pre>{setupInstructions.templateExample}</pre>
              </div>
              <div className="demo-notice">
                <p><strong>Current Mode:</strong> Demo Mode (OTP shown in console)</p>
                <p>Follow the setup instructions to enable real email sending.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPLogin;
