import asyncHandler from 'express-async-handler';
import Ground from '../models/Ground.js';

const createGround = asyncHandler(async (req, res) => {
  const { name, sport, address, pricePerHour, coordinates, amenities } = req.body;

  const ground = await Ground.create({
    owner: req.user._id,
    name,
    sport,
    address,
    pricePerHour,
    location: { type: 'Point', coordinates },
    amenities: amenities || [],
  });

  res.status(201).json(ground);
});

const getMyGrounds = asyncHandler(async (req, res) => {
  const grounds = await Ground.find({ owner: req.user._id });
  res.json(grounds);
});

const getNearbyGrounds = asyncHandler(async (req, res) => {
  const { longitude, latitude, radius = 5000, sport } = req.query;

  const query = {
    isActive: true,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseFloat(radius),
      },
    },
  };

  if (sport) query.sport = sport;

  const grounds = await Ground.find(query).populate('owner', 'name phone');
  res.json(grounds);
});

const getGroundById = asyncHandler(async (req, res) => {
  const ground = await Ground.findById(req.params.id).populate('owner', 'name phone');

  if (!ground) {
    res.status(404);
    throw new Error('Ground not found');
  }

  res.json(ground);
});

const addSlots = asyncHandler(async (req, res) => {
  const { slots } = req.body;

  const ground = await Ground.findOne({ _id: req.params.id, owner: req.user._id });

  if (!ground) {
    res.status(404);
    throw new Error('Ground not found or unauthorized');
  }

  ground.slots.push(...slots);
  await ground.save();

  res.json(ground);
});

const deleteGround = asyncHandler(async (req, res) => {
  const ground = await Ground.findOne({ _id: req.params.id, owner: req.user._id });

  if (!ground) {
    res.status(404);
    throw new Error('Ground not found or unauthorized');
  }

  await ground.deleteOne();
  res.json({ message: 'Ground deleted successfully' });
});

export { createGround, getMyGrounds, getNearbyGrounds, getGroundById, addSlots, deleteGround };

