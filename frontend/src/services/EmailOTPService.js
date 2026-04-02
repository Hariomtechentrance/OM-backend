// EmailJS OTP Service - FREE and Easy Implementation
// This service uses EmailJS which is free for development use

class EmailOTPService {
  constructor() {
    // Initialize EmailJS with your credentials
    // Get these from https://www.emailjs.com/
    this.init();
  }

  init() {
    // Replace with your EmailJS credentials
    // 1. Sign up at https://www.emailjs.com/
    // 2. Create an email service
    // 3. Create an email template
    // 4. Get your public key
    
    // For demo purposes, we'll use a mock implementation
    // In production, replace with your actual EmailJS credentials:
    /*
    emailjs.init("YOUR_PUBLIC_KEY");
    */
    
    this.isConfigured = false; // Set to true when EmailJS is configured
  }

  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via EmailJS
  async sendOTP(email, otp) {
    try {
      // For demo: Store OTP in localStorage and show in console
      localStorage.setItem('currentOTP', otp);
      localStorage.setItem('otpEmail', email);
      localStorage.setItem('otpTimestamp', Date.now().toString());
      
      console.log(`🔐 OTP for ${email}: ${otp}`);
      console.log('⚠️ In production, this will be sent via EmailJS');
      
      // Mock email sending for demo
      const mockEmailResponse = await this.mockEmailSend(email, otp);
      
      return {
        success: true,
        message: 'OTP sent successfully to your email',
        demo: true
      };
      
      // In production with EmailJS, use this code:
      /*
      if (!this.isConfigured) {
        throw new Error('EmailJS not configured');
      }
      
      const templateParams = {
        to_email: email,
        otp_code: otp,
        expiration_time: '10 minutes'
      };
      
      const response = await emailjs.send(
        'YOUR_SERVICE_ID',    // Your EmailJS service ID
        'YOUR_TEMPLATE_ID',    // Your EmailJS template ID
        templateParams
      );
      
      return {
        success: true,
        message: 'OTP sent successfully to your email',
        emailjs_response: response
      };
      */
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }

  // Mock email sending for demo
  async mockEmailSend(email, otp) {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a simple email content
    const emailContent = {
      to: email,
      subject: '🔐 Your OTP Code for Black Locust',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #c09345; color: white; padding: 20px; text-align: center;">
            <h1>Black Locust</h1>
            <p>OTP Verification Code</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Your OTP Code is:</h2>
            <div style="font-size: 32px; font-weight: bold; color: #c09345; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p>© 2024 Black Locust - Premium Fashion</p>
          </div>
        </div>
      `
    };
    
    console.log('📧 Email would be sent:', emailContent);
    return emailContent;
  }

  // Verify OTP
  verifyOTP(enteredOTP) {
    const storedOTP = localStorage.getItem('currentOTP');
    const otpTimestamp = localStorage.getItem('otpTimestamp');
    
    // Check if OTP exists
    if (!storedOTP) {
      return {
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      };
    }
    
    // Check if OTP is expired (10 minutes)
    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (Date.now() - parseInt(otpTimestamp) > expirationTime) {
      this.clearOTPData();
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      };
    }
    
    // Verify OTP
    if (enteredOTP === storedOTP) {
      this.clearOTPData();
      return {
        success: true,
        message: 'OTP verified successfully'
      };
    } else {
      return {
        success: false,
        message: 'Invalid OTP. Please try again.'
      };
    }
  }

  // Clear OTP data
  clearOTPData() {
    localStorage.removeItem('currentOTP');
    localStorage.removeItem('otpEmail');
    localStorage.removeItem('otpTimestamp');
  }

  // Check if EmailJS is configured
  isEmailJSConfigured() {
    return this.isConfigured;
  }

  // Get setup instructions
  getSetupInstructions() {
    return {
      title: 'EmailJS Setup Instructions',
      steps: [
        '1. Go to https://www.emailjs.com/ and sign up for free',
        '2. Create an email service (Gmail, Outlook, etc.)',
        '3. Create an email template with variables: {{to_email}}, {{otp_code}}, {{expiration_time}}',
        '4. Get your Public Key, Service ID, and Template ID',
        '5. Update the init() method in EmailOTPService.js with your credentials',
        '6. Uncomment the EmailJS code and comment out the mock implementation'
      ],
      templateExample: `
        Email Template Example:
        Subject: Your OTP Code for Black Locust
        
        <h2>Your OTP Code is: {{otp_code}}</h2>
        <p>This code will expire in {{expiration_time}}.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    };
  }
}

// Create singleton instance
const emailOTPService = new EmailOTPService();

export default emailOTPService;
