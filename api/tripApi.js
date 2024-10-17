const express = require('express');
const { createTrip, getTrips, getTrip, updateTrip, deleteTrip, getTripsByRegiment } = require('../services/tripService');
const authService = require('../services/authService');
const checkForeignKey = require('../middlewares/checkForeignKey');
const Regiment = require('../models/regimentModel');
const SmallUnit = require('../models/smallUnitModel');

const router = express.Router();

router
  .route('/')
  .get(getTrips)
  .post(
    authService.protect,
    authService.allowedTo('admin'),
    checkForeignKey(Regiment, 'regiment'),
    checkForeignKey(SmallUnit, 'smallUnitID'),
    createTrip
  );

router
  .route('/:id')
  .get(getTrip)
  .patch(authService.protect, authService.allowedTo('admin'), updateTrip)
  .delete(authService.protect, authService.allowedTo('admin'), deleteTrip);

router
  .route('/regiment/:regimentId')
  .get(getTripsByRegiment);

module.exports = router;
