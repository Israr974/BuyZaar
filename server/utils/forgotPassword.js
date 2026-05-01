const forgotPasswordOtp = ({ name, otp }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0;">
          <h1 style="margin: 0; color: #333333;">BuyZaar</h1>
        </div>
        
        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; color: #333333;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #333333;">We received a request to reset your password. Use the OTP below to proceed:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background-color: #f8f9fa; padding: 15px 30px; border-radius: 8px; border: 1px solid #e9ecef;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
            </div>
          </div>
          
          <p style="font-size: 14px; color: #666666;">⚠️ This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <p style="font-size: 14px; color: #666666;">If you didn't request this, please ignore this email.</p>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999999;">
          <p>Thank you for shopping with us!</p>
          <p>&copy; 2024 BuyZaar. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default forgotPasswordOtp;