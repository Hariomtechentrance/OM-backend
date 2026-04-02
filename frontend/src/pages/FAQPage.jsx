import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is Black Locust's return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging. Items must be in the same condition as received, with all tags attached. Refunds are processed within 5-7 business days after we receive the returned item."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days. International shipping varies by location but generally takes 10-15 business days. You'll receive a tracking number once your order ships."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. You can check if we ship to your country during the checkout process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers for orders over $500."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with a tracking number. You can use this number on our website's order tracking page or the carrier's website to monitor your package's progress."
    },
    {
      question: "What sizes do you offer?",
      answer: "We offer sizes from XS to XXL for most items, and some products are available in XXXL. Each product page includes a detailed size chart to help you find the perfect fit."
    },
    {
      question: "How do I care for my Black Locust products?",
      answer: "Care instructions vary by product. Most items can be machine washed in cold water and tumble dried on low heat. Please check the care label on each specific product for detailed instructions."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer premium gift wrapping services for a small additional fee. You can select this option during checkout and include a personalized message."
    },
    {
      question: "What is your loyalty program?",
      answer: "Our Black Locust Rewards program offers points for every purchase, which can be redeemed for discounts on future orders. Members also get early access to new collections and exclusive offers."
    },
    {
      question: "How can I contact customer service?",
      answer: "You can reach our customer service team via email at support@blacklocust.com, phone at 1-800-BLACK-LOCUST, or through our live chat feature available on our website."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about Black Locust products and services</p>
        </div>

        <div className="faq-categories">
          <div className="category-section">
            <h2>Orders & Shipping</h2>
            <div className="faq-list">
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                  <div className="faq-question" onClick={() => toggleFAQ(index)}>
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle">{activeIndex === index ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h2>Products & Care</h2>
            <div className="faq-list">
              {faqs.slice(4, 7).map((faq, index) => (
                <div key={index + 4} className={`faq-item ${activeIndex === index + 4 ? 'active' : ''}`}>
                  <div className="faq-question" onClick={() => toggleFAQ(index + 4)}>
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle">{activeIndex === index + 4 ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-section">
            <h2>Services & Support</h2>
            <div className="faq-list">
              {faqs.slice(7).map((faq, index) => (
                <div key={index + 7} className={`faq-item ${activeIndex === index + 7 ? 'active' : ''}`}>
                  <div className="faq-question" onClick={() => toggleFAQ(index + 7)}>
                    <h3>{faq.question}</h3>
                    <span className="faq-toggle">{activeIndex === index + 7 ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="faq-contact">
          <div className="contact-card">
            <h2>Still have questions?</h2>
            <p>Our customer service team is here to help you with any additional questions you may have.</p>
            <div className="contact-options">
              <div className="contact-option">
                <h3>Email</h3>
                <p>support@blacklocust.com</p>
              </div>
              <div className="contact-option">
                <h3>Phone</h3>
                <p>1-800-BLACK-LOCUST</p>
              </div>
              <div className="contact-option">
                <h3>Live Chat</h3>
                <p>Available 24/7 on our website</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
