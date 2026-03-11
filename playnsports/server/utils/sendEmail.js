import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"PLAYNSPORTS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your PLAYNSPORTS OTP',
      html: `OTP: ${otp}`,
    });

    console.log("OTP email sent ✅");
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Email sending failed");
  }
};

export default sendOTPEmail;
