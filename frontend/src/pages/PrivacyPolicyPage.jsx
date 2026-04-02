import React from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      <div className="container">
        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: January 1, 2024</p>
          <p>Black Locust is committed to protecting your privacy and ensuring the security of your personal information.</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>Information We Collect</h2>
            
            <div className="info-category">
              <h3>Personal Information</h3>
              <p>When you make a purchase or create an account, we collect:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by third-party payment processors)</li>
                <li>Account credentials (username and password)</li>
                <li>Preferences and communication preferences</li>
              </ul>
            </div>

            <div className="info-category">
              <h3>Automatically Collected Information</h3>
              <p>We automatically collect certain information when you visit our website:</p>
              <ul>
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Click patterns and navigation paths</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div className="info-category">
              <h3>Third-Party Information</h3>
              <p>We may receive information about you from third-party sources:</p>
              <ul>
                <li>Social media platforms when you connect with us</li>
                <li>Payment processors for transaction verification</li>
                <li>Shipping carriers for delivery updates</li>
                <li>Marketing analytics providers</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>How We Use Your Information</h2>
            
            <div className="use-cases">
              <div className="use-case">
                <h3>To Provide Our Services</h3>
                <ul>
                  <li>Process and fulfill your orders</li>
                  <li>Manage your account and preferences</li>
                  <li>Provide customer support</li>
                  <li>Send order confirmations and shipping updates</li>
                </ul>
              </div>

              <div className="use-case">
                <h3>To Improve Our Website</h3>
                <ul>
                  <li>Analyze user behavior and preferences</li>
                  <li>Test new features and functionality</li>
                  <li>Optimize website performance</li>
                  <li>Fix technical issues and bugs</li>
                </ul>
              </div>

              <div className="use-case">
                <h3>For Marketing and Communication</h3>
                <ul>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Personalize your shopping experience</li>
                  <li>Show relevant advertisements</li>
                  <li>Share special offers and new product announcements</li>
                </ul>
              </div>

              <div className="use-case">
                <h3>For Legal and Security Purposes</h3>
                <ul>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                  <li>Protect our rights and property</li>
                  <li>Enforce our terms of service</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>Cookies and Tracking Technologies</h2>
            
            <div className="cookies-info">
              <h3>What Are Cookies?</h3>
              <p>Cookies are small text files stored on your device that help us enhance your experience on our website.</p>
              
              <div className="cookie-types">
                <div className="cookie-type">
                  <h4>Essential Cookies</h4>
                  <p>Required for basic website functionality, including shopping cart and checkout processes.</p>
                </div>
                
                <div className="cookie-type">
                  <h4>Performance Cookies</h4>
                  <p>Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                </div>
                
                <div className="cookie-type">
                  <h4>Functional Cookies</h4>
                  <p>Enable enhanced functionality and personalization, such as remembering your preferences.</p>
                </div>
                
                <div className="cookie-type">
                  <h4>Marketing Cookies</h4>
                  <p>Used to deliver advertisements that are relevant to you and your interests.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>Data Sharing and Third Parties</h2>
            
            <div className="sharing-info">
              <p>We may share your information with third parties in the following circumstances:</p>
              
              <div className="sharing-categories">
                <div className="sharing-category">
                  <h3>Service Providers</h3>
                  <ul>
                    <li>Payment processors (Stripe, PayPal)</li>
                    <li>Shipping carriers (FedEx, UPS, USPS)</li>
                    <li>Email service providers</li>
                    <li>Cloud hosting providers</li>
                    <li>Analytics providers</li>
                  </ul>
                </div>
                
                <div className="sharing-category">
                  <h3>Legal Requirements</h3>
                  <ul>
                    <li>When required by law or legal process</li>
                    <li>To protect our rights and property</li>
                    <li>To prevent fraud or ensure security</li>
                    <li>In connection with a business transaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>Your Rights and Choices</h2>
            
            <div className="rights-info">
              <div className="right-item">
                <h3>Access and Update</h3>
                <p>You can access and update your personal information through your account settings or by contacting our customer service.</p>
              </div>
              
              <div className="right-item">
                <h3>Data Portability</h3>
                <p>You can request a copy of your personal information in a machine-readable format.</p>
              </div>
              
              <div className="right-item">
                <h3>Marketing Preferences</h3>
                <p>You can opt out of marketing communications at any time by clicking the unsubscribe link or updating your preferences.</p>
              </div>
              
              <div className="right-item">
                <h3>Cookie Controls</h3>
                <p>You can control cookies through your browser settings and our cookie consent tool.</p>
              </div>
              
              <div className="right-item">
                <h3>Account Deletion</h3>
                <p>You can request deletion of your account and personal information, subject to legal obligations.</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>Data Security</h2>
            
            <div className="security-info">
              <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
              
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing through PCI-compliant providers</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Employee training on data protection</li>
                <li>Access controls and authentication systems</li>
                <li>Secure data storage and backup systems</li>
              </ul>
              
              <p className="security-note">While we take reasonable precautions to protect your information, no method of transmission over the internet is 100% secure.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>Children's Privacy</h2>
            
            <div className="children-privacy">
              <p>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>International Data Transfers</h2>
            
            <div className="international-info">
              <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in accordance with applicable data protection laws.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>Changes to This Policy</h2>
            
            <div className="changes-info">
              <p>We may update this privacy policy from time to time. We will notify you of any material changes by:</p>
              
              <ul>
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice on our website</li>
              </ul>
              
              <p>Your continued use of our website after any changes constitutes acceptance of the updated policy.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            
            <div className="contact-info">
              <p>If you have any questions about this privacy policy or our data practices, please contact us:</p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <h3>Email</h3>
                  <p>privacy@blacklocust.com</p>
                </div>
                
                <div className="contact-item">
                  <h3>Mail</h3>
                  <p>Black Locust Privacy Officer<br />
                  123 Fashion Avenue<br />
                  New York, NY 10018<br />
                  United States</p>
                </div>
                
                <div className="contact-item">
                  <h3>Phone</h3>
                  <p>1-800-BLACK-LOCUST</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
