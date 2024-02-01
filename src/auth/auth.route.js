const express = require("express");
const { registerUser, verifyOTP, verify_update } = require("./auth.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyOTP);
router.post("/verify-and-update", verify_update);

module.exports = router;
