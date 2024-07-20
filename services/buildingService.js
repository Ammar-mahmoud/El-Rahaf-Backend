const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Building = require('../models/buildingModel');

exports.uploadBuildingImages = uploadMixOfImages([
    {
      name: 'imageCover',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]);
  
  exports.resizeBuildingImages = asyncHandler(async (req, res, next) => {
    //1- Image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFileName = `building-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/buildings/${imageCoverFileName}`);
  
      // Save image into our db
      req.body.imageCover = imageCoverFileName;
    }
    
    //2- Image processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `building-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/buildings/${imageName}`);
  
          // Save image into our db
          req.body.images.push(imageName);
        })
      );
    }
    next();
  });


// @desc    Get list of buildings
// @route   GET /api/v1/buildings
// @access  Public
exports.getBuildings = factory.getAll(Building);

// @desc    Get specific building by id
// @route   GET /api/v1/buildings/:id
// @access  Public
exports.getBuilding = factory.getOne(Building,'reviews');

// @desc    Create building
// @route   POST  /api/v1/buildings
// @access  Private/Protect/User
exports.createBuilding = factory.createOne(Building);

// @desc    Update specific building
// @route   PATCH /api/v1/buildings/:id
// @access  Private/Protect/User
exports.updateBuilding = factory.updateOne(Building);

// @desc    Delete specific building
// @route   DELETE /api/v1/buildings/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteBuilding = factory.deleteOne(Building);