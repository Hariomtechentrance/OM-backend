import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    
    const mailOptions = {
      from: `"Black Locust Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #000; margin-bottom: 10px;">Black Locust Fashion</h2>
            <p style="color: #666; margin: 0;">Welcome to our fashion community!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #000; margin-bottom: 15px;">Verify Your Email Address</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up! To complete your registration and start shopping, please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 20px; text-align: center;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all;">${verificationUrl}</span>
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    
    const mailOptions = {
      from: `"Black Locust Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #000; margin-bottom: 10px;">Black Locust Fashion</h2>
            <p style="color: #666; margin: 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #000; margin-bottom: 15px;">Reset Your Password</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" 
                 style="background: #dc3545; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 20px; text-align: center;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all;">${resetUrl}</span>
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Black Locust Fashion" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Black Locust Fashion!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #000; margin-bottom: 10px;">Welcome to Black Locust Fashion!</h2>
            <p style="color: #666; margin: 0;">Your fashion journey begins here</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #000; margin-bottom: 15px;">Hello ${name}!</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Black Locust Fashion! We're excited to have you as part of our community. 
              You now have access to our premium collection of fashion items.
            </p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop" 
                 style="background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Start Shopping
              </a>
            </div>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>Happy Shopping!<br>The Black Locust Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
