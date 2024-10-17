const express = require("express");

const {
  createRegiment,
  deleteRegiment,
  getRegiment,
  getRegiments,
  updateRegiment,
} = require("../services/regimentService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getRegiments)
  .post(authService.protect, authService.allowedTo("admin"), createRegiment);
router
  .route("/:id")
  .get(getRegiment)
  .patch(authService.protect, authService.allowedTo("admin"), updateRegiment)
  .delete(authService.protect, authService.allowedTo("admin"), deleteRegiment);



module.exports = router;
