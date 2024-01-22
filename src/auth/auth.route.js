const express = require("express");
const { registerUser, verifyOTP } = require("./auth.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyOTP);

module.exports = router;
