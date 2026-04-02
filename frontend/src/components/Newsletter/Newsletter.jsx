import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would call your API
      // await axios.post('/api/newsletter/subscribe', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2>STAY IN THE KNOW</h2>
          <p>Subscribe to our newsletter for exclusive offers and updates</p>
          
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="email-input"
              />
              <button 
                type="submit" 
                className="subscribe-btn"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'SUBSCRIBE'}
              </button>
            </div>
          </form>
          
          <p className="privacy-note">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;