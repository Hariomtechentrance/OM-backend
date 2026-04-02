import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>ABOUT BLACK LOCUST</h1>
          <p>Crafting Premium Fashion Since 2020</p>
        </div>
      </div>

      <div className="container">
        <div className="story-section">
          <h2>Our Story</h2>
          <div className="story-content">
            <div className="story-text">
              <p>
                Black Locust was born from a passion for creating exceptional clothing that combines style, comfort, and sustainability. Founded in 2020, we set out to revolutionize the fashion industry by offering premium quality pieces that don't compromise on ethics or environmental responsibility.
              </p>
              <p>
                Our name, Black Locust, symbolizes strength, resilience, and natural beauty - qualities we infuse into every piece we create. Just as the black locust tree stands tall and strong, our clothing is designed to empower and inspire confidence in those who wear it.
              </p>
            </div>
            <div className="story-image">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="Our Story" />
            </div>
          </div>
        </div>

        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>We prioritize eco-friendly materials and ethical production practices to minimize our environmental impact.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">👔</div>
              <h3>Quality Craftsmanship</h3>
              <p>Every piece is meticulously crafted with attention to detail, ensuring durability and timeless style.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Customer First</h3>
              <p>Your satisfaction is our priority. We're committed to providing exceptional service and products that exceed expectations.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3>Innovation</h3>
              <p>We constantly push boundaries with innovative designs and sustainable fashion solutions.</p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" alt="CEO" />
              </div>
              <h3>Alex Johnson</h3>
              <p className="member-title">Founder & CEO</p>
              <p className="member-bio">Visionary leader with 15+ years in fashion industry</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=300" alt="Creative Director" />
              </div>
              <h3>Sarah Chen</h3>
              <p className="member-title">Creative Director</p>
              <p className="member-bio">Award-winning designer with a passion for sustainable fashion</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300" alt="Operations Manager" />
              </div>
              <h3>Michael Davis</h3>
              <p className="member-title">Operations Manager</p>
              <p className="member-bio">Expert in supply chain and sustainable manufacturing</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" alt="Marketing Head" />
              </div>
              <h3>Emma Wilson</h3>
              <p className="member-title">Marketing Head</p>
              <p className="member-bio">Digital marketing expert focused on brand storytelling</p>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>By the Numbers</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        <div className="mission-section">
          <h2>Our Mission</h2>
          <div className="mission-content">
            <div className="mission-text">
              <p>
                At Black Locust, our mission is to redefine fashion by creating clothing that looks good, feels good, and does good. We believe that style and sustainability can coexist, and we're committed to proving it with every piece we create.
              </p>
              <p>
                We envision a world where fashion is a force for positive change - where clothing empowers individuals while protecting our planet. Through innovation, craftsmanship, and conscious design, we're building that future, one garment at a time.
              </p>
            </div>
            <div className="mission-image">
              <img src="https://images.unsplash.com/photo-1554220155-6af6a11a0a6c?w=600" alt="Our Mission" />
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h2>Get in Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h3>📍 Visit Us</h3>
                <p>123 Fashion Street<br />Mumbai, Maharashtra 400001<br />India</p>
              </div>
              <div className="contact-item">
                <h3>📞 Call Us</h3>
                <p>+91 98765 43210<br />Mon-Sat: 9AM-6PM</p>
              </div>
              <div className="contact-item">
                <h3>📧 Email Us</h3>
                <p>info@blacklocust.com<br />support@blacklocust.com</p>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message" rows="4"></textarea>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
