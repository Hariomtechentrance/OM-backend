import React from 'react';

const MinimalApp = () => {
  return (
    <div style={{ 
      padding: '40px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Black Locust Fashion</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Minimal Test - If you see this, the basic React app works!</p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        backdropFilter: 'blur(10px)'
      }}>
        <h2>Next Steps:</h2>
        <ul>
          <li>✅ React is working</li>
          <li>✅ CSS is loading</li>
          <li>✅ No infinite loops</li>
        </ul>
      </div>
    </div>
  );
};

export default MinimalApp;
