import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(192, 147, 69, 0.3)',
            borderTop: '4px solid #c09345',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (but not from login pages)
  if (!isAuthenticated && 
      location.pathname !== '/login' && 
      location.pathname !== '/admin/login' && 
      location.pathname !== '/register') {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check admin access if required
  if (adminOnly && !isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#c09345',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
