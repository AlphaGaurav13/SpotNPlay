import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Ground from '../models/Ground.js';

const createBooking = asyncHandler(async (req, res) => {
  const { slotId } = req.body;

  const ground = await Ground.findById(req.params.id);
  if (!ground) {
    res.status(404);
    throw new Error('Ground not found');
  }

  const slot = ground.slots.id(slotId);
  if (!slot) {
    res.status(404);
    throw new Error('Slot not found');
  }

  if (slot.isBooked) {
    res.status(400);
    throw new Error('Slot already booked');
  }

  slot.isBooked = true;
  slot.bookedBy = req.user._id;
  await ground.save();

  const booking = await Booking.create({
    player: req.user._id,
    ground: ground._id,
    slot: slot._id,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    totalPrice: ground.pricePerHour,
    status: 'confirmed',
  });

  res.status(201).json(booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ player: req.user._id })
    .populate('ground', 'name address sport pricePerHour')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

const getGroundBookings = asyncHandler(async (req, res) => {
  const ground = await Ground.findOne({ _id: req.params.id, owner: req.user._id });
  if (!ground) {
    res.status(404);
    throw new Error('Ground not found or unauthorized');
  }

  const bookings = await Booking.find({ ground: req.params.id })
    .populate('player', 'name phone')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, player: req.user._id });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found or unauthorized');
  }

  const ground = await Ground.findById(booking.ground);
  const slot = ground.slots.id(booking.slot);
  if (slot) {
    slot.isBooked = false;
    slot.bookedBy = null;
    await ground.save();
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ message: 'Booking cancelled successfully' });
});

export { createBooking, getMyBookings, getGroundBookings, cancelBooking };