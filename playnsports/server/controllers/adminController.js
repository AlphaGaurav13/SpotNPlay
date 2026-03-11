import asyncHandler from 'express-async-handler';
import Coach from '../models/Coach.js';
import User from '../models/User.js';

const getAllCoaches = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const coaches = await Coach.find(query).populate('user', 'name email avatar').sort('-createdAt');
  res.json(coaches);
});

const approveCoach = asyncHandler(async (req, res) => {
  const coach = await Coach.findById(req.params.id);
  if (!coach) { res.status(404); throw new Error('Coach not found'); }
  coach.status = 'approved';
  coach.rejectionReason = '';
  await coach.save();
  // Update user role to coach
  await User.findByIdAndUpdate(coach.user, { role: 'coach' });
  res.json({ message: 'Coach approved ✅', coach });
});

const rejectCoach = asyncHandler(async (req, res) => {
  const coach = await Coach.findById(req.params.id);
  if (!coach) { res.status(404); throw new Error('Coach not found'); }
  coach.status = 'rejected';
  coach.rejectionReason = req.body.reason || 'Application rejected';
  await coach.save();
  res.json({ message: 'Coach rejected', coach });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalCoaches, pendingCoaches, approvedCoaches] = await Promise.all([
    User.countDocuments(),
    Coach.countDocuments(),
    Coach.countDocuments({ status: 'pending' }),
    Coach.countDocuments({ status: 'approved' }),
  ]);
  res.json({ totalUsers, totalCoaches, pendingCoaches, approvedCoaches });
});

export { getAllCoaches, approveCoach, rejectCoach, getDashboardStats };