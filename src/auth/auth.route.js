const express = require("express");
const { userregister } = require("./auth.controller");
const router = express.Router();

router.post("/register", userregister);
// router.post("/verify-otp", verifyOtp);
// router.post("/resend-otp", resendOtp);
// router.post("/forget-password", authController.forgetPassword);

module.exports = router;
