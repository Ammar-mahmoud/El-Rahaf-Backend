const express = require('express');

const {
  getSmallUnit,
  getSmallUnits,
  createSmallUnit,
  updateSmallUnit,
  deleteSmallUnit,
  createFilterObj,
  uploadSmallUnitImages,
  resizeSmallUnitImages,
} = require('../services/smallUnitService');

const authService = require('../services/authService');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getSmallUnits)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'worker'),
    uploadSmallUnitImages,
    resizeSmallUnitImages,
    createSmallUnit
  );

router
  .route("/:id")
  .get(getSmallUnit)
  .patch(
    authService.protect,
    authService.allowedTo('admin', 'worker'),
    uploadSmallUnitImages,
    resizeSmallUnitImages,
    updateSmallUnit
  )
  .delete(authService.protect, authService.allowedTo('admin'), deleteSmallUnit);

module.exports = router;
