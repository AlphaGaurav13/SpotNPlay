import nodemailer from "nodemailer";
console.log(process.env.EMAIL_USER);
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"PlayNSports" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Your OTP Code</h2>
        <p>Your verification OTP is:</p>
        <h1 style="letter-spacing:5px">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTPEmail;