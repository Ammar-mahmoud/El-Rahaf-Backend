const asyncHandler = require("express-async-handler");
const Trip = require("../models/tripModel");
const factory = require('./handlersFactory');
const ApiError = require('../utils/api_error');

// @desc    Create a new trip
// @route   POST /api/v1/trips
// @access  Private/Protect/Admin
exports.createTrip = factory.createOne(Trip);

// @desc    Get all trips
// @route   GET /api/v1/trips
// @access  Public
exports.getTrips = factory.getAll(Trip);

// @desc    Get a specific trip by ID
// @route   GET /api/v1/trips/:id
// @access  Public
exports.getTrip = factory.getOne(Trip);

// @desc    Update a trip by ID
// @route   PATCH /api/v1/trips/:id
// @access  Private/Protect/Admin
exports.updateTrip = factory.updateOne(Trip);

// @desc    Delete a trip by ID
// @route   DELETE /api/v1/trips/:id
// @access  Private/Protect/Admin
exports.deleteTrip = factory.deleteOne(Trip);

// @desc    Get all trips for a specific regiment
// @route   GET /api/v1/regiments/:regimentId/trips
// @access  Public
exports.getTripsByRegiment = asyncHandler(async (req, res, next) => {
  const trips = await Trip.find({ regiment: req.params.regimentId });

  if (!trips || trips.length === 0) {
    return next(new ApiError(`No trips found for this regiment`, 404));
  }

  res.status(200).json({
    results: trips.length,
    data: trips,
  });
});
