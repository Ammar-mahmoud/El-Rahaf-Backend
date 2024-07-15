const { check } = require("express-validator");
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

// exports.updateUserValidator = [
//   check("id").isMongoId().withMessage("Invalid User id format"),
//   check("firstName")
//     .optional()
//     .withMessage("First name required")
//     .isLength({ min: 3 })
//     .withMessage("Too short User name")
//     .isLength({ max: 15 })
//     .withMessage("Too long User name"),

//   check("lastName")
//     .optional()
//     .withMessage("Last name required")
//     .isLength({ min: 3 })
//     .withMessage("Too short User name")
//     .isLength({ max: 15 })
//     .withMessage("Too long User name"),

//   check("phone")
//     .optional()
//     .isMobilePhone(["ar-EG"])
//     .withMessage("Invalid phone number only accepted Egy Phone numbers")
//     .custom((val) =>
//       User.findOne({ phone: val }).then((user) => {
//         if (user) {
//           return Promise.reject(new Error("phone already in user"));
//         }
//       })
//     ),

//   check("profileImg").optional(),
//   check("role").optional(),
//   validatorMiddleware,
// ];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("phone")
    .notEmpty()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number only accepted Egy Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("phone already in user"));
        }
      })
    ),

  validatorMiddleware,
];
