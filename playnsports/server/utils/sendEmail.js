import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"PLAYNSPORTS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your PLAYNSPORTS OTP",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    console.log("OTP email sent ✅");
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Email sending failed");
  }
};

export default sendOTPEmail;