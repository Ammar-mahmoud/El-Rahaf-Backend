const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const factory = require('./handlersFactory');
const SmallUnit = require('../models/smallUnitModel');

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');

exports.uploadSmallUnitImages = uploadMixOfImages([
    {
      name: 'images',
      maxCount: 5,
    },
  ]);
  
  exports.resizeSmallUnitImages = asyncHandler(async (req, res, next) => {
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `smallUnit-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/smallUnits/${imageName}`);
  
          // Save image into our db
          req.body.images.push(imageName);
        })
      );
    }
    next();
  });


// Nested route
// GET /api/v1/buildings/:buildingId/smallUnits
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.buildingId) filterObject = { building: req.params.buildingId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of smallUnits
// @route   GET /api/v1/smallUnits
// @access  Public
exports.getSmallUnits = factory.getAll(SmallUnit);

// @desc    Get specific smallUnit by id
// @route   GET /api/v1/smallUnits/:id
// @access  Public
exports.getSmallUnit = factory.getOne(SmallUnit);

// @desc    Create smallUnit
// @route   POST  /api/v1/smallUnits
// @access  Private/Protect/admin-worker
exports.createSmallUnit = factory.createOne(SmallUnit);

// @desc    Update specific smallUnit
// @route   PATCH /api/v1/smallUnits/:id
// @access  Private/Protect/admin-worker
exports.updateSmallUnit = factory.updateOne(SmallUnit);

// @desc    Delete specific smallUnit
// @route   DELETE /api/v1/smallUnits/:id
// @access  Private/Protect/Admin-Manager
exports.deleteSmallUnit = factory.deleteOne(SmallUnit);