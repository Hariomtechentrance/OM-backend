import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>CONTACT US</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>We'd love to hear from you. Whether you have a question about our products, sizing, or anything else, our team is ready to answer all your questions.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-info-text">
                  <h3>Visit Our Store</h3>
                  <p>123 Fashion Street<br />Mumbai, Maharashtra 400001<br />India</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-info-text">
                  <h3>Call Us</h3>
                  <p>+91 98765 43210<br />+91 98765 43211</p>
                  <p>Monday - Saturday: 9:00 AM - 6:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-info-text">
                  <h3>Email Us</h3>
                  <p>info@blacklocust.com<br />support@blacklocust.com</p>
                  <p>We'll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <div className="contact-info-text">
                  <h3>Live Chat</h3>
                  <p>Chat with our team<br />Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" className="social-icon">📘 Facebook</a>
                <a href="#" className="social-icon">📷 Instagram</a>
                <a href="#" className="social-icon">🐦 Twitter</a>
                <a href="#" className="social-icon">💼 LinkedIn</a>
                <a href="#" className="social-icon">📺 YouTube</a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>

            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-list">
                <div className="faq-item">
                  <h4>What is your return policy?</h4>
                  <p>We offer a 7-day return policy for all unused items in original packaging.</p>
                </div>
                <div className="faq-item">
                  <h4>How long does shipping take?</h4>
                  <p>Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.</p>
                </div>
                <div className="faq-item">
                  <h4>Do you ship internationally?</h4>
                  <p>Yes, we ship to over 50 countries worldwide. International shipping takes 10-15 business days.</p>
                </div>
                <div className="faq-item">
                  <h4>How can I track my order?</h4>
                  <p>Once your order ships, you'll receive a tracking number via email to monitor your package.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
