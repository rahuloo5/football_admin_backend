const express = require("express");
const {
  registerUser,
  verifyOTP,
  verify_update,
  getUserByNumber,
  resendOtp,
} = require("./auth.controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyOTP);
router.post("/verify-and-update", verify_update);
router.post("/resend-otp", resendOtp);

module.exports = router;
