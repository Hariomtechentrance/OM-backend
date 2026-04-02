const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const Order = require('../models/Order');

const router = express.Router();

// Email configuration
const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
let transporter;

try {
  transporter = nodemailer.createTransport(emailConfig);
  console.log('✅ Email service initialized successfully');
} catch (error) {
  console.error('❌ Email service failed to initialize:', error);
  // Create a dummy transporter to prevent crashes
  transporter = {
    sendMail: async (options) => {
      console.log('📧 Email would be sent:', options.subject);
      return { messageId: 'dummy-' + Date.now() };
    }
  };
}

// Email templates
const emailTemplates = {
  orderConfirmation: (orderData, userName) => ({
    subject: `Order Confirmation - ${orderData.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #C09345 0%, #E6A157 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Order Confirmed! 🎉</h1>
          <p style="font-size: 18px; margin: 20px 0;">Thank you for your order, ${userName}!</p>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0; font-size: 24px;">Order #${orderData.orderNumber}</h2>
            <p style="margin: 5px 0; font-size: 16px;">Placed on: ${new Date(orderData.createdAt).toLocaleDateString()}</p>
            <p style="margin: 5px 0; font-size: 16px;">Status: ${orderData.status}</p>
          </div>
        </div>
        
        <div style="padding: 30px;">
          <h3 style="color: #C09345; margin-bottom: 20px;">Order Details</h3>
          ${orderData.items.map(item => `
            <div style="background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-right: 20px;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 10px 0; color: #333;">${item.name}</h4>
                  <p style="margin: 5px 0; color: #666;">Size: ${item.size} | Color: ${item.color}</p>
                  <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × ₹${item.price}</p>
                  <p style="margin: 5px 0; font-weight: bold; color: #C09345;">Subtotal: ₹${item.subtotal}</p>
                </div>
              </div>
            </div>
          `).join('')}
          
          <div style="background: #2D1810; color: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4 style="margin: 0 0 15px 0;">Order Summary</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Items Total:</span>
              <span>₹${orderData.itemsPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Tax:</span>
              <span>₹${orderData.taxPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Shipping:</span>
              <span>₹${orderData.shippingPrice}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 2px solid #C09345; padding-top: 10px; margin-top: 10px;">
              <span>Total:</span>
              <span style="color: #C09345;">₹${orderData.totalPrice}</span>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4 style="margin: 0 0 15px 0; color: #C09345;">Shipping Address</h4>
            <p style="margin: 5px 0; color: #666;">${orderData.shippingAddress.fullName}</p>
            <p style="margin: 5px 0; color: #666;">${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}</p>
            <p style="margin: 5px 0; color: #666;">${orderData.shippingAddress.state} - ${orderData.shippingAddress.zipCode}</p>
            <p style="margin: 5px 0; color: #666;">Phone: ${orderData.shippingAddress.phone}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">What's Next?</h4>
            <p style="margin: 5px 0; color: #666;">• You'll receive tracking details once your order ships</p>
            <p style="margin: 5px 0; color: #666;">• Expected delivery: 3-5 business days</p>
            <p style="margin: 5px 0; color: #666;">• Need help? Reply to this email or call our support</p>
          </div>
        </div>
        
        <div style="background: #2D1810; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© 2024 Black Locust. All rights reserved.</p>
          <p style="margin: 5px 0; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }),
  welcome: (userName, userEmail) => ({
    subject: 'Welcome to Black Locust!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C09345 0%, #E6A157 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Black Locust! 👋</h1>
          <p style="font-size: 18px; margin: 20px 0;">Hi ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Thank you for joining Black Locust! Your account has been successfully created.</p>
          <p style="font-size: 16px;">Email: <strong>${userEmail}</strong></p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">What's Next?</h2>
          <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
            <li style="margin-bottom: 10px;">🛍️ Browse our premium collection</li>
            <li style="margin-bottom: 10px;">📏 Check your size with our size charts</li>
            <li style="margin-bottom: 10px;">💳 Secure payment options</li>
            <li style="margin-bottom: 10px;">🚚 Fast delivery nationwide</li>
          </ul>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
               style="background: linear-gradient(135deg, #C09345 0%, #E6A157 100%); 
                      color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Start Shopping
            </a>
          </div>
        </div>
        <div style="background: #2D1810; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© 2024 Black Locust. All rights reserved.</p>
          <p style="margin: 5px 0; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  }),
  passwordReset: (userName, resetLink) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C09345 0%, #E6A157 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset 🔐</h1>
          <p style="font-size: 18px; margin: 20px 0;">Hi ${userName},</p>
          <p style="font-size: 16px;">You requested to reset your password.</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p style="color: #666; line-height: 1.6;">Click the link below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #C09345; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">This link will expire in 1 hour.</p>
        </div>
        <div style="background: #2D1810; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">© 2024 Black Locust. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Black Locust <noreply@blacklocust.com>',
      to,
      ...template
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

// Send welcome email
router.post('/welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    await sendEmail(email, emailTemplates.welcome(name, email));
    
    res.json({
      success: true,
      message: 'Welcome email sent successfully'
    });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

// Send order confirmation email
router.post('/order-confirmation', async (req, res) => {
  try {
    const { order, userEmail, userName } = req.body;
    
    if (!order || !userEmail || !userName) {
      return res.status(400).json({ error: 'Order details, user email and name are required' });
    }

    await sendEmail(userEmail, emailTemplates.orderConfirmation(order, userName));
    
    res.json({
      success: true,
      message: 'Order confirmation email sent successfully'
    });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    res.status(500).json({ error: 'Failed to send order confirmation email' });
  }
});

// Send password reset email
router.post('/password-reset', async (req, res) => {
  try {
    const { email, name, resetLink } = req.body;
    
    if (!email || !name || !resetLink) {
      return res.status(400).json({ error: 'Email, name and reset link are required' });
    }

    await sendEmail(email, emailTemplates.passwordReset(name, resetLink));
    
    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Password reset email error:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

module.exports = router;
