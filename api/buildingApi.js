const express = require("express");

// const {
//     createBuildingValidator,
//     updateBuildingValidator,
//     getBuildingValidator,
//     deleteBuildingValidator,
//   } = require('../utils/validators/buildingValidator');

const {
  getBuilding,
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  uploadBuildingImages,
  resizeBuildingImages,
} = require("../services/buildingService");

const authService = require('../services/authService');
const reviewsRoute = require('./reviewApi');
const smallUnitRoute = require('./smallUnitApi');

const router = express.Router();

router.use('/:buildingId/reviews', reviewsRoute);
router.use('/:buildingId/smallUnits', smallUnitRoute);
router
  .route('/')
  .get(getBuildings)
  .post(
    authService.protect,
    authService.allowedTo('admin'),
    uploadBuildingImages,
    resizeBuildingImages,
    createBuilding
  );
router
  .route('/:id')
  .get(getBuilding)
  .patch(
    authService.protect,
    authService.allowedTo('worker', 'admin'),
    uploadBuildingImages,
    resizeBuildingImages,
    updateBuilding
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteBuilding
  );

module.exports = router;