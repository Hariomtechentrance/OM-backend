import React from 'react';
import { Link } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <div className="auth-modal-header">
              <h3>Authentication Required</h3>
              <button className="close-modal" onClick={onClose}>
                  ×
              </button>
          </div>
          
          <div className="auth-modal-content">
              <div className="auth-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10 4.48 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-4 7c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4-4 1.79-4 4z" fill="#c09345"/>
                  </svg>
              </div>
              
              <h4>Please login or register to add items to cart</h4>
              <p>You need to be logged in to add products to your shopping cart.</p>
              
              <div className="auth-modal-actions">
                  <button className="auth-btn login-btn" onClick={() => { onLogin(); onClose(); }}>
                      Login
                  </button>
                  <button className="auth-btn register-btn" onClick={() => { onRegister(); onClose(); }}>
                      Register
                  </button>
              </div>
              
              <div className="auth-modal-footer">
                  <p>Don't have an account? <Link to="/register" onClick={() => { onClose(); onRegister(); }}>Sign up</Link></p>
                  <p>Already have an account? <Link to="/login" onClick={() => { onClose(); onLogin(); }}>Sign in</Link></p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AuthModal;
