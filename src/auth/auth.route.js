const router = new require("express").Router();
const authController = require("./auth.controller");

// router.post(
//   "/register",
//   // [validateMiddleware.validateRegisterData],
//   authController.createUser
// );

// router.post("/verify-otp", authController);

// router.post("/resend-otp", authController);

// router.post("/login-admin", authController);

// router.post("/forget-password", authController, forgetPassword);
module.exports = router;
