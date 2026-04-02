import React from 'react';
import './TermsOfServicePage.css';

const TermsOfServicePage = () => {
  return (
    <div className="terms-of-service-page">
      <div className="container">
        <div className="page-header">
          <h1>Terms of Service</h1>
          <p>Last updated: January 1, 2024</p>
          <p>Welcome to Black Locust. These Terms of Service govern your use of our website and purchase of our products.</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Black Locust's website and making purchases from our store, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or purchase our products.</p>
            <p>These terms may be updated from time to time. Your continued use of our website constitutes acceptance of any changes.</p>
          </section>

          <section className="terms-section">
            <h2>2. Products and Services</h2>
            
            <div className="subsection">
              <h3>Product Descriptions</h3>
              <p>We strive to provide accurate product descriptions, pricing, and availability information. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free.</p>
              <p>All products are subject to availability, and we reserve the right to discontinue any product at any time.</p>
            </div>

            <div className="subsection">
              <h3>Pricing</h3>
              <p>All prices are listed in USD and are subject to change without notice. Prices do not include sales tax, which may be applied based on your location.</p>
              <p>We reserve the right to correct any pricing errors and may cancel orders placed at incorrect prices.</p>
            </div>

            <div className="subsection">
              <h3>Product Availability</h3>
              <p>Product availability is subject to change without notice. We make every effort to display accurate inventory information, but we cannot guarantee the availability of any product.</p>
              <p>If a product you ordered becomes unavailable, we will notify you and provide options for a refund or alternative product.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>3. Orders and Payment</h2>
            
            <div className="subsection">
              <h3>Order Acceptance</h3>
              <p>Your receipt of an electronic order confirmation does not signify our acceptance of your order, nor does it constitute confirmation of our offer to sell.</p>
              <p>We reserve the right at any time after receipt of your order to accept or decline your order for any reason.</p>
            </div>

            <div className="subsection">
              <h3>Payment Methods</h3>
              <p>We accept various payment methods including credit cards, debit cards, PayPal, and other payment processors as indicated on our website.</p>
              <p>Payment information is processed securely by third-party payment processors. We do not store your complete payment information.</p>
            </div>

            <div className="subsection">
              <h3>Order Cancellation</h3>
              <p>You may cancel your order within 24 hours of placement for a full refund. After 24 hours, cancellation may not be possible if the order has been processed for shipping.</p>
              <p>To cancel an order, please contact our customer service immediately.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>4. Shipping and Delivery</h2>
            
            <div className="subsection">
              <h3>Shipping Times</h3>
              <p>Shipping times are estimates and not guaranteed. Delivery times may vary based on your location and external factors beyond our control.</p>
              <p>We are not responsible for delays caused by shipping carriers, weather conditions, or other circumstances beyond our control.</p>
            </div>

            <div className="subsection">
              <h3>Risk of Loss</h3>
              <p>All purchases are subject to shipping terms and conditions. Risk of loss and title for all merchandise passes to you upon our delivery to the shipping carrier.</p>
            </div>

            <div className="subsection">
              <h3>Shipping Charges</h3>
              <p>Shipping charges are calculated based on your location and selected shipping method. These charges will be clearly displayed during checkout.</p>
              <p>Free shipping promotions may be offered from time to time and are subject to specific terms and conditions.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>5. Returns and Refunds</h2>
            
            <div className="subsection">
              <h3>Return Policy</h3>
              <p>We offer a 30-day return policy for unused items in original condition. Please refer to our Shipping & Returns page for detailed return instructions.</p>
              <p>Items must be returned in their original packaging with all tags attached. We reserve the right to refuse returns that do not meet these conditions.</p>
            </div>

            <div className="subsection">
              <h3>Refund Process</h3>
              <p>Refunds are processed within 5-7 business days after we receive your returned item. Refunds are issued to the original payment method.</p>
              <p>Shipping costs are non-refundable unless the return is due to our error or a defective product.</p>
            </div>

            <div className="subsection">
              <h3>Exchanges</h3>
              <p>We offer free exchanges for different sizes or colors within 30 days of purchase. Exchange items are shipped once the original items are received.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>6. Intellectual Property</h2>
            
            <div className="subsection">
              <h3>Copyright and Trademarks</h3>
              <p>All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Black Locust or its content suppliers and is protected by copyright and trademark laws.</p>
              <p>You may not use, reproduce, or distribute any content from this website without our express written permission.</p>
            </div>

            <div className="subsection">
              <h3>Product Images</h3>
              <p>Product images on our website are for illustrative purposes only. Actual products may vary slightly in appearance due to lighting, monitor settings, and manufacturing variations.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>7. User Conduct</h2>
            
            <div className="subsection">
              <h3>Prohibited Activities</h3>
              <p>You agree not to use our website for any unlawful purposes or in any way that could damage, disable, or impair the website.</p>
              <p>Prohibited activities include but are not limited to:</p>
              <ul>
                <li>Using the website for fraudulent purposes</li>
                <li>Interfering with or disrupting the website or servers</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Harassing or abusing other users or our staff</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>User Accounts</h3>
              <p>If you create an account on our website, you are responsible for maintaining the confidentiality of your account information.</p>
              <p>You agree to notify us immediately of any unauthorized use of your account.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>8. Privacy</h2>
            
            <div className="subsection">
              <h3>Privacy Policy</h3>
              <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.</p>
              <p>By using our website, you consent to the collection and use of your information as described in our Privacy Policy.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>9. Limitation of Liability</h2>
            
            <div className="subsection">
              <h3>Disclaimer of Warranties</h3>
              <p>Our website and products are provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied.</p>
              <p>We do not warrant that the website will be uninterrupted or error-free, or that any defects will be corrected.</p>
            </div>

            <div className="subsection">
              <h3>Limitation of Damages</h3>
              <p>In no event shall Black Locust be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or purchase of our products.</p>
              <p>Our total liability to you for any cause of action shall not exceed the amount you paid for the products in question.</p>
            </div>
          </section>

          <section className="terms-section">
            <h2>10. Indemnification</h2>
            
            <p>You agree to indemnify and hold Black Locust and its affiliates harmless from any claims, damages, or expenses arising from your use of our website or violation of these terms.</p>
          </section>

          <section className="terms-section">
            <h2>11. Governing Law</h2>
            
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law principles.</p>
            <p>Any disputes arising from these terms shall be resolved in the courts located in New York, New York.</p>
          </section>

          <section className="terms-section">
            <h2>12. Changes to Terms</h2>
            
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website.</p>
            <p>Your continued use of our website after any changes constitutes acceptance of the modified terms.</p>
          </section>

          <section className="terms-section">
            <h2>13. Contact Information</h2>
            
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <h3>Email</h3>
                <p>legal@blacklocust.com</p>
              </div>
              
              <div className="contact-item">
                <h3>Mail</h3>
                <p>Black Locust Legal Department<br />
                123 Fashion Avenue<br />
                New York, NY 10018<br />
                United States</p>
              </div>
              
              <div className="contact-item">
                <h3>Phone</h3>
                <p>1-800-BLACK-LOCUST</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
