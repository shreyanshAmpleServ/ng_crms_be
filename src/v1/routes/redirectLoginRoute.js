const express = require("express");
const redirectionController = require("../controller/redirectionController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/crms/public/login",
  // authenticateToken,
  redirectionController.redirectionLogin
);

module.exports = router;
