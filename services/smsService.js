import https from 'https';

/**
 * Send OTP via Fast2SMS (India).
 * Falls back to demo mode if FAST2SMS_API_KEY is not set.
 * Get a free key at https://www.fast2sms.com
 */
export const sendOTPSMS = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.log(`📱 Demo Mode - SMS OTP for ${phone}: ${otp}`);
    return { success: true, demo: true };
  }

  const message = `Your Black Locust OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`;

  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      authorization: apiKey,
      sender_id: 'BLCUST',
      message,
      language: 'english',
      route: 'q',
      numbers: phone,
    });

    const options = {
      hostname: 'www.fast2sms.com',
      path: `/dev/bulkV2?${params.toString()}`,
      method: 'GET',
      headers: { 'cache-control': 'no-cache' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.return === true) {
            resolve({ success: true, demo: false });
          } else {
            reject(new Error(parsed.message || 'SMS sending failed'));
          }
        } catch {
          reject(new Error('Invalid SMS API response'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
};

export default { sendOTPSMS };
