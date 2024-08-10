const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/auth_validator");

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  verifyPassResetCode,
  registrationCode,
  VerifyAccount
} = require("../services/authService");

const { uploadUserImage, resizeImage } = require("../services/userService");

const router = express.Router();

router.post("/signup", uploadUserImage, resizeImage, signupValidator, signup);
router.post("/registrationCode", registrationCode);
router.post("/verifyAccount", VerifyAccount);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);


module.exports = router;
