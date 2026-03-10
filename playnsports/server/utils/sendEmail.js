import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"PLAYNSPORTS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your PLAYNSPORTS OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 30px; background: #1a1a2e; border-radius: 12px; color: white;">
        <h2 style="color: #4ade80; text-align: center;">PLAYNSPORTS</h2>
        <p style="text-align: center; color: #9ca3af;">Your One Time Password</p>
        <div style="background: #374151; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4ade80; font-size: 40px; letter-spacing: 10px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #9ca3af; text-align: center; font-size: 14px;">Expires in <strong style="color: white;">10 minutes</strong></p>
      </div>
    `,
  });
};

export default sendOTPEmail;
