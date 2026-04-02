import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service in production
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production' && window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              🚨
            </div>
            
            <h1 style={{ 
              color: '#333', 
              fontSize: '24px', 
              marginBottom: '16px',
              fontFamily: 'Inter, sans-serif'
            }}>
              Oops! Something went wrong
            </h1>
            
            <p style={{ 
              color: '#666', 
              fontSize: '16px', 
              marginBottom: '32px',
              lineHeight: '1.5'
            }}>
              We're sorry, but something unexpected happened. 
              Our team has been notified and is working to fix this issue.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '200px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleGoHome}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Go to Homepage
              </button>
              
              <button
                onClick={this.handleReload}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                Reload Page
              </button>
            </div>

            <div style={{ 
              marginTop: '24px', 
              fontSize: '14px', 
              color: '#999' 
            }}>
              Error ID: {Date.now()}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
