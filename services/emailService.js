import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // Check if email credentials are configured
  const isConfigured = process.env.EMAIL_HOST && 
                       process.env.EMAIL_USER && 
                       process.env.EMAIL_PASS;

  if (!isConfigured) {
    console.warn('⚠️  Email service not configured. Using demo mode.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP
 */
export const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  // If transporter is null, we're in demo mode
  if (!transporter) {
    console.log(`📧 Demo Mode - OTP for ${email}: ${otp}`);
    return {
      success: true,
      demo: true,
      message: 'Demo mode - OTP logged to console'
    };
  }

  try {
    const mailOptions = {
      from: `"Black Locust" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Black Locust Login',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #000;
              font-size: 28px;
              margin: 0;
            }
            .otp-box {
              background-color: #fff;
              border: 2px solid #000;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #000;
              letter-spacing: 8px;
              margin: 10px 0;
            }
            .message {
              text-align: center;
              color: #666;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>BLACK LOCUST</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>You requested to login to your Black Locust account using OTP. Please use the following One-Time Password to complete your login:</p>
            
            <div class="otp-box">
              <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Your OTP Code</div>
              <div class="otp-code">${otp}</div>
              <div style="color: #999; font-size: 12px; margin-top: 10px;">Valid for 10 minutes</div>
            </div>
            
            <p class="message">Enter this code in the login page to access your account.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Never share this OTP with anyone</li>
                <li>Black Locust will never ask for your OTP via phone or email</li>
                <li>This OTP will expire in 10 minutes</li>
              </ul>
            </div>
            
            <p>If you didn't request this OTP, please ignore this email or contact our support team if you have concerns about your account security.</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Black Locust. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        BLACK LOCUST - OTP Login
        
        Your OTP Code: ${otp}
        
        This code is valid for 10 minutes.
        
        Enter this code in the login page to access your account.
        
        Security Notice:
        - Never share this OTP with anyone
        - Black Locust will never ask for your OTP via phone or email
        - This OTP will expire in 10 minutes
        
        If you didn't request this OTP, please ignore this email.
        
        © ${new Date().getFullYear()} Black Locust. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ OTP email sent successfully:', info.messageId);
    
    return {
      success: true,
      demo: false,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

/**
 * Send welcome email (optional)
 * @param {string} email - Recipient email
 * @param {string} name - User name
 */
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`📧 Demo Mode - Welcome email for ${email}`);
    return { success: true, demo: true };
  }

  try {
    const mailOptions = {
      from: `"Black Locust" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Black Locust!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .logo {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo h1 {
              color: #000;
              font-size: 28px;
              margin: 0;
            }
            .button {
              display: inline-block;
              background-color: #000;
              color: #fff;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #999;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <h1>BLACK LOCUST</h1>
            </div>
            
            <h2>Welcome, ${name}! 🎉</h2>
            
            <p>Thank you for joining Black Locust! We're excited to have you as part of our community.</p>
            
            <p>Your account has been successfully created and you can now:</p>
            <ul>
              <li>Browse our exclusive collection</li>
              <li>Add items to your wishlist</li>
              <li>Enjoy secure checkout</li>
              <li>Track your orders</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://blacklocust.in'}" class="button">Start Shopping</a>
            </div>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Black Locust. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Welcome email error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendOTPEmail,
  sendWelcomeEmail
};
