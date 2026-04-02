const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// @desc    Send welcome email
// @route   POST /api/email/welcome
// @access  Private
exports.sendWelcomeEmail = async (req, res) => {
  try {
    const transporter = createTransporter();
    const user = await User.findById(req.user._id);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Welcome to Black Locust - Premium Fashion for Men & Kids',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">Welcome to Black Locust!</h1>
            <p style="color: #7f8c8d; font-size: 16px;">Your journey to premium fashion starts here</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 15px;">Hello ${user.name},</h2>
            <p style="color: #34495e; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Black Locust! We're excited to have you as part of our community. 
              Discover our curated collection of premium clothing for men and kids.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/products" 
                 style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Shop Now
              </a>
            </div>
          </div>
          
          <div style="border-top: 1px solid #ecf0f1; padding-top: 20px;">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #34495e; line-height: 1.8;">
              <li>Browse our latest collection</li>
              <li>Create your wishlist</li>
              <li>Enjoy exclusive member benefits</li>
              <li>Get early access to sales</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #7f8c8d; font-size: 14px;">
            <p>Black Locust - Premium Fashion for Men & Kids</p>
            <p>${process.env.FRONTEND_URL}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send welcome email' });
  }
};

// @desc    Send order confirmation email
// @route   POST /api/email/order-confirmation
// @access  Private
exports.sendOrderConfirmationEmail = async (req, res) => {
  try {
    const { orderId } = req.body;
    const transporter = createTransporter();
    
    // Get order details (you'll need to import Order model)
    const Order = require('../models/Order');
    const order = await Order.findById(orderId).populate('user orderItems.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: order.user.email,
      subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50;">Order Confirmed!</h1>
            <p style="color: #7f8c8d;">Thank you for your purchase</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> $${order.totalPrice}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3>Items Ordered</h3>
            ${order.orderItems.map(item => `
              <div style="border-bottom: 1px solid #ecf0f1; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} | Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</p>
                <p>Price: $${item.price}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/profile" 
               style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
              Track Your Order
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Order confirmation email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send order confirmation email' });
  }
};

// @desc    Send password reset email
// @route   POST /api/email/password-reset
// @access  Public
exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { email, resetToken } = req.body;
    const transporter = createTransporter();
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Password Reset - Black Locust',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50;">Password Reset</h1>
            <p style="color: #7f8c8d;">Reset your Black Locust password</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2>Hello ${user.name},</h2>
            <p>You requested a password reset. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #7f8c8d; font-size: 14px;">
            <p>Black Locust - Premium Fashion for Men & Kids</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

// @desc    Send promotional email
// @route   POST /api/email/promotional
// @access  Private/Admin
exports.sendPromotionalEmail = async (req, res) => {
  try {
    const { subject, message, targetAudience } = req.body;
    const transporter = createTransporter();
    
    // Get users based on target audience
    let users = [];
    switch (targetAudience) {
      case 'all':
        users = await User.find({ isActive: true });
        break;
      case 'customers':
        users = await User.find({ isActive: true, 'cart.0': { $exists: true } });
        break;
      case 'vip':
        // Users with high order value
        const Order = require('../models/Order');
        const vipUserIds = await Order.aggregate([
          { $group: { _id: '$user', totalSpent: { $sum: '$totalPrice' } } },
          { $match: { totalSpent: { $gt: 500 } } },
          { $project: { _id: 1 } }
        ]);
        users = await User.find({ _id: { $in: vipUserIds.map(u => u._id) } });
        break;
      default:
        users = await User.find({ isActive: true });
    }

    const emailPromises = users.map(user => {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: subject,
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50;">${subject}</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h2>Hello ${user.name},</h2>
              <div>${message}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/products" 
                 style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                Shop Now
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #7f8c8d; font-size: 14px;">
              <p>Black Locust - Premium Fashion for Men & Kids</p>
            </div>
          </div>
        `,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    res.json({ 
      message: `Promotional email sent to ${users.length} users successfully` 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send promotional email' });
  }
};
