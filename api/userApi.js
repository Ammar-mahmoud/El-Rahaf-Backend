const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require('../utils/validators/user_validator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);

// router.get('/getMe', getLoggedUserData, getUser);
// router.put('/changeMyPassword', updateLoggedUserPassword);
// router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
// router.delete('/deleteMe', deleteLoggedUserData);

// Admin
router.use(authService.allowedTo('admin', 'worker'));
router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .patch(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;