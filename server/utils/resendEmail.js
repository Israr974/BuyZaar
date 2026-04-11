import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API);

const sendMails = async ({to, subject, html}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'BuyZaar <onboarding@resend.dev>',
      to, 
      subject,
      html,
      
    });

    if (error) {
      console.error("Email sending failed:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Email sendMails error:", error);
    return null;
  }
};

export default sendMails;
