import React from 'react';
import './ShippingReturnPage.css';

const ShippingReturnPage = () => {
  return (
    <div className="shipping-return-page">
      <div className="container">
        <div className="page-header">
          <h1>Shipping & Returns</h1>
          <p>Everything you need to know about getting your Black Locust products and our return policy</p>
        </div>

        <div className="content-grid">
          <section className="shipping-section">
            <h2>Shipping Information</h2>
            
            <div className="shipping-types">
              <div className="shipping-type">
                <h3>Standard Shipping</h3>
                <div className="shipping-details">
                  <p><strong>Delivery Time:</strong> 5-7 business days</p>
                  <p><strong>Cost:</strong> $5.99 (Free on orders over $75)</p>
                  <p><strong>Tracking:</strong> Included</p>
                  <p><strong>Availability:</strong> Nationwide</p>
                </div>
              </div>

              <div className="shipping-type">
                <h3>Express Shipping</h3>
                <div className="shipping-details">
                  <p><strong>Delivery Time:</strong> 2-3 business days</p>
                  <p><strong>Cost:</strong> $15.99</p>
                  <p><strong>Tracking:</strong> Real-time tracking</p>
                  <p><strong>Availability:</strong> Nationwide</p>
                </div>
              </div>

              <div className="shipping-type">
                <h3>International Shipping</h3>
                <div className="shipping-details">
                  <p><strong>Delivery Time:</strong> 10-15 business days</p>
                  <p><strong>Cost:</strong> $25.99 - $45.99 (based on location)</p>
                  <p><strong>Tracking:</strong> Included</p>
                  <p><strong>Availability:</strong> Select countries</p>
                </div>
              </div>

              <div className="shipping-type">
                <h3>Next Day Delivery</h3>
                <div className="shipping-details">
                  <p><strong>Delivery Time:</strong> Next business day</p>
                  <p><strong>Cost:</strong> $29.99</p>
                  <p><strong>Tracking:</strong> Real-time tracking</p>
                  <p><strong>Availability:</strong> Major cities only</p>
                </div>
              </div>
            </div>

            <div className="shipping-info">
              <h3>Important Shipping Information</h3>
              <ul>
                <li>Orders are processed within 1-2 business days</li>
                <li>Shipping times are estimates and may vary</li>
                <li>You'll receive a tracking number via email once your order ships</li>
                <li>Signature required for orders over $500</li>
                <li>We ship to PO boxes and APO/FPO addresses</li>
                <li>International orders may be subject to customs fees</li>
              </ul>
            </div>
          </section>

          <section className="returns-section">
            <h2>Return Policy</h2>
            
            <div className="return-policy">
              <h3>30-Day Return Policy</h3>
              <p>We want you to love your Black Locust purchase. If you're not completely satisfied, you can return items within 30 days of delivery.</p>
              
              <div className="return-conditions">
                <h4>Return Conditions:</h4>
                <ul>
                  <li>Items must be unused and in original condition</li>
                  <li>All original tags and packaging must be intact</li>
                  <li>Items must be unworn, unwashed, and unaltered</li>
                  <li>Footwear must include original shoebox</li>
                  <li>Accessories must include all original components</li>
                </ul>
              </div>

              <div className="non-returnable">
                <h4>Non-Returnable Items:</h4>
                <ul>
                  <li>Final sale items (marked as final sale)</li>
                  <li>Personalized or customized items</li>
                  <li>Underwear and intimate apparel</li>
                  <li>Perfumes and cosmetics</li>
                  <li>Gift cards</li>
                </ul>
              </div>
            </div>

            <div className="return-process">
              <h3>How to Return</h3>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Initiate Return</h4>
                    <p>Log into your account and select the order you wish to return</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Print Return Label</h4>
                    <p>Download and print your prepaid return shipping label</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Package Items</h4>
                    <p>Pack items securely in original packaging if possible</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Ship Back</h4>
                    <p>Drop off package at any authorized shipping location</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="refund-info">
              <h3>Refund Process</h3>
              <ul>
                <li>Refunds are processed within 5-7 business days after we receive your return</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the item is defective</li>
                <li>Store credit is available immediately upon return processing</li>
                <li>You'll receive email confirmation when your refund is processed</li>
              </ul>
            </div>

            <div className="exchange-info">
              <h3>Exchanges</h3>
              <p>Want a different size or color? We offer free exchanges within 30 days of purchase.</p>
              <ul>
                <li>Select "Exchange" instead of "Return" when initiating your return</li>
                <li>Choose your preferred size, color, or different item</li>
                <li>No additional shipping charges for exchanges</li>
                <li>Exchange items are shipped once original items are received</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="contact-support">
          <div className="support-card">
            <h2>Need Help?</h2>
            <p>Our customer service team is here to assist with any shipping or return questions.</p>
            <div className="support-options">
              <div className="support-option">
                <h3>Email Support</h3>
                <p>support@blacklocust.com</p>
                <p>Response within 24 hours</p>
              </div>
              <div className="support-option">
                <h3>Phone Support</h3>
                <p>1-800-BLACK-LOCUST</p>
                <p>Mon-Fri: 9AM-8PM EST</p>
              </div>
              <div className="support-option">
                <h3>Live Chat</h3>
                <p>Available on our website</p>
                <p>24/7 assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturnPage;
