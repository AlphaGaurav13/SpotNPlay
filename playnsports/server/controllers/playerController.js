import asyncHandler from 'express-async-handler';
import Player from '../models/Player.js';

const setAvailability = asyncHandler(async (req, res) => {
  const { sport, isAvailable, coordinates, skillLevel, bio } = req.body;

  let player = await Player.findOne({ user: req.user._id });

  if (player) {
    player.sport = sport;
    player.isAvailable = isAvailable;
    player.location.coordinates = coordinates;
    player.skillLevel = skillLevel || player.skillLevel;
    player.bio = bio || player.bio;
    await player.save();
  } else {
    player = await Player.create({
      user: req.user._id,
      sport,
      isAvailable,
      location: { type: 'Point', coordinates },
      skillLevel,
      bio,
    });
  }

  res.json(player);
});

const getNearbyPlayers = asyncHandler(async (req, res) => {
  const { longitude, latitude, radius = 5000, sport } = req.query;

  const query = {
    isAvailable: true,
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

  const players = await Player.find(query).populate('user', 'name phone avatar');

  res.json(players);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const player = await Player.findOne({ user: req.user._id }).populate('user', 'name phone avatar');

  if (!player) {
    res.status(404);
    throw new Error('Player profile not found');
  }

  res.json(player);
});

const deleteAvailability = asyncHandler(async (req, res) => {
  const player = await Player.findOne({ user: req.user._id });

  if (!player) {
    res.status(404);
    throw new Error('Player profile not found');
  }

  player.isAvailable = false;
  await player.save();

  res.json({ message: 'You are now offline' });
});

export { setAvailability, getNearbyPlayers, getMyProfile, deleteAvailability };

