const forgotPasswordOtp = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      <p>Thank you,<br/>BuyZaar Team</p>
    </div>
  `;
};

export default forgotPasswordOtp;
