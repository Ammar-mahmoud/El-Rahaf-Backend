const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/api_error');
const createToken = require('../utils/createToken');
const sendOtp = require('../utils/sendOtp');

const User = require('../models/userModel');

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    password: req.body.password,
    profileImg: req.body.profileImg,
  });
  res.status(201).json({ data: user});
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and phone in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ phone: req.body.phone });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect phone or password', 401));
  }
  if (!user.isVerified) {
    return next(new ApiError('user is not verified yet', 401));
  }
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password. please login again..',
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc    registrationCode
// @route   POST /api/v1/auth/registrationCode
// @access  Public
exports.registrationCode = asyncHandler(async (req, res, next) => {
  // 1) Get user by phone
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    return next(
      new ApiError(`There is no user with that phone ${req.body.phone}`, 404)
    );
  }
  if (user.isVerified) {
    return next(
      new ApiError(`this account is already verified`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const OTPCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash('sha256')
    .update(OTPCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.verificationCode = hashedCode;
  // Add expiration time for password reset code (10 min)
  user.verificationExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // 3) Send the reset code via phone
  const message = `Hi ${user.firstName},\n We received a request to verify your Account. \n ${OTPCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n shaghaf Team`;
  try {
    await sendOtp({
      phone: user.phone,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.verificationCode = undefined;
    user.verificationExpires = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending phone', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'OTP code sent to phone' });
});

// @desc    Verify Account code
// @route   POST /api/v1/auth/verifyAccount
// @access  Public
exports.VerifyAccount = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedCode = crypto
    .createHash('sha256')
    .update(req.body.OTPCode)
    .digest('hex');

  const user = await User.findOne({
    verificationCode: hashedCode,
    verificationExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('code invalid or expired'));
  }

  // 2) Reset code valid
  user.isVerified = true;
  await user.save();

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc    Authorization (User Permissions)
// ["admin", "worker"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by phone
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    return next(
      new ApiError(`There is no user with that phone ${req.body.phone}`, 404)
    );
  }

  if (!user.isVerified) {
    return next(new ApiError('user is not verified yet', 401));
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via phone
  const message = `Hi ${user.name},\n We received a request to reset the password on your Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n El-Rahaf Team`;
  try {
    await sendOtp({
      phone: user.phone,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError('There is an error in sending phone', 500));
  }

  res
    .status(200)
    .json({ status: 'Success', message: 'Reset code sent to phone' });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: 'Success',
  });
});


// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on phone
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    return next(
      new ApiError(`There is no user with phone ${req.body.phone}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});