const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("First name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 15 })
    .withMessage("Too long User name"),

  check("lastName")
    .notEmpty()
    .withMessage("Last name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 15 })
    .withMessage("Too long User name"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  check("phone")
    .notEmpty()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("phone already in user"));
        }
      })
    ),

  check("profileImg").optional(),
  check("role").optional(),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name").optional(),

  check("phone")
    .notEmpty()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("phone already in user"));
        }
      })
    ),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("phone")
    .notEmpty()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("phone already in user"));
        }
      })
    ),

  validatorMiddleware,
];
