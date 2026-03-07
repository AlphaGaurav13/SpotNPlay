import asyncHandler from 'express-async-handler';
import OTP from '../models/OTP.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendOTPEmail from '../utils/sendEmail.js';

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.deleteMany({ email });

  await OTP.create({ email, otp });

  await sendOTPEmail(email, otp);

  res.json({ message: 'OTP sent to your email ✅' });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp, name, phone, role } = req.body;

  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  if (new Date() > otpRecord.expiresAt) {
    await OTP.deleteOne({ email });
    res.status(400);
    throw new Error('OTP expired');
  }

  await OTP.deleteOne({ email });

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name: name || 'Player',
      email,
      password: Math.random().toString(36),
      role: role || 'player',
      phone: phone || '',
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    token: generateToken(user._id, user.role),
  });
});

const checkUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  res.json({ exists: !!user });
});

export { sendOTP, verifyOTP, checkUser };

