const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/auth_validator");

const { signup, login, resetPassword } = require("../services/authService");

const { uploadUserImage, resizeImage } = require("../services/userService");

const router = express.Router();

router.post("/signup", uploadUserImage, resizeImage, signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/resetPassword", resetPassword);

module.exports = router;
