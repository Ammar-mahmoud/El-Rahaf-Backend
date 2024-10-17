const express = require('express');
const Building = require('../models/buildingModel');
const checkForeignKey = require('../middlewares/checkForeignKey');

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setBuildingIdAndUserIdToBody,
} = require('../services/reviewService');

const authService = require('../services/authService');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo('user'),
    checkForeignKey(Building, 'buildingId'),
    setBuildingIdAndUserIdToBody,
    createReview
  );

router
  .route('/:id')
  .get(getReview)
  .patch(
    authService.protect,
    authService.allowedTo('user'),
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo('user', 'manager', 'admin'),
    deleteReview
  );

module.exports = router;
