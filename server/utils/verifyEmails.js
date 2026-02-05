const verifyEmail = ({ name, url }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Dear ${name},</p>
      <p>Thank you for registering on BuyZaar.</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">
        Verify Email
      </a>
      <p>If you did not register, please ignore this email.</p>
    </div>
  `;
};

export default verifyEmail;
