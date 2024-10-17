const asyncHandler = require("express-async-handler");
const factory = require('./handlersFactory');
const Regiment = require('../models/regimentModel')
const Trip = require('../models/tripModel');

// @desc    Get list of regiments
// @route   GET /api/v1/regiments
// @access  Public
exports.getRegiments = factory.getAll(Regiment);

// @desc    Get specific regiment by id
// @route   GET /api/v1/regiments/:id
// @access  Public
exports.getRegiment = factory.getOne(Regiment);

// @desc    Create regiment
// @route   POST  /api/v1/regiments
// @access  Private/Protect/Admin
exports.createRegiment = asyncHandler( async (req, res) =>{
    try {
        // Create the regiment
        const regiment = new Regiment({
            building: req.body.buildingId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            activities: req.body.activities
        });

        await regiment.save();

        // Create trips and associate them with the regiment
        const trips = req.body.trips.map(tripData => new Trip({
                regiment: regiment._id,
                smallUnitID: tripData.smallUnitID,
                remaining: tripData.remaining,
                quantity: tripData.quantity,
                price: tripData.price
            }));

        const savedTrips = await Trip.insertMany(trips);

        // Link the trips to the regiment
        regiment.trips.push(...savedTrips.map(trip => trip._id));
        await regiment.save();

        res.status(201).json(regiment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @desc    Update specific regiment
// @route   PATCH /api/v1/regiments/:id
// @access  Private/Protect/Admin
exports.updateRegiment = asyncHandler(async (req, res) => {
    try {
        // Find the regiment by ID
        const regiment = await Regiment.findById(req.params.id);

        if (!regiment) {
            return res.status(404).json({ error: "Regiment not found" });
        }

        // Update regiment fields
        regiment.building = req.body.buildingId || regiment.building;
        regiment.startDate = req.body.startDate || regiment.startDate;
        regiment.endDate = req.body.endDate || regiment.endDate;
        regiment.activities = req.body.activities || regiment.activities;

        // If trips are provided, update them
        if (req.body.trips && req.body.trips.length > 0) {
            // Delete existing trips associated with the regiment
            await Trip.deleteMany({ regiment: regiment._id });

            // Create and add new trips
            const newTrips = req.body.trips.map(tripData => new Trip({
                    regiment: regiment._id,
                    smallUnitID: tripData.smallUnitID,
                    remaining: tripData.remaining,
                    quantity: tripData.quantity,
                    price: tripData.price
                }));

            const savedTrips = await Trip.insertMany(newTrips);

            // Update the regiment's trips array with new trip IDs
            regiment.trips = savedTrips.map(trip => trip._id);
        }

        // Save the updated regiment
        await regiment.save();

        res.status(200).json(regiment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});;

// @desc    Delete specific regiment
// @route   DELETE /api/v1/regiments/:id
// @access  Private/Protect/Admin
exports.deleteRegiment = asyncHandler(async (req, res) => {
    try {
        // Find the regiment by ID
        const regiment = await Regiment.findById(req.params.id);

        if (!regiment) {
            return res.status(404).json({ error: "Regiment not found" });
        }

        // Delete all trips associated with this regiment
        await Trip.deleteMany({ regiment: regiment._id });

        // Delete the regiment
        await regiment.remove();

        res.status(200).json({ success: true, message: "Regiment and all associated trips deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
