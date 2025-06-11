const express = require("express");
const {
  deleteduser,
  updateuser,
  getUserById,
  createuser,
  getAllUsers,
  deleteUser,
  createUserplan,
  createsub,
  sendNotification,
  transactionapi,
  changePassword,
  sentOTP,
  resetPassword,
  createProfile
} = require("./user.controller");
const { authMiddleware } = require("../middleware/authorization.middleware");

const router = express.Router();

//auth API
router.post("/change-password", changePassword);
// router.post("/send-otp", sentOTP);
// router.post("/reset-password", resetPassword);

//user API
router.post("/users", authMiddleware, createuser);
router.get("/users",authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.patch("/users/:id", authMiddleware, updateuser);
router.delete("/users/:id", authMiddleware, deleteUser);

//profile API
router.post("/user/profile", authMiddleware, createProfile); // Create or update user profile

// User plan API
router.post("/users-plan/:planId", authMiddleware, createUserplan);
router.get("/transaction", authMiddleware, transactionapi);

// mailtrap API
router.post("/send-email", authMiddleware, sendNotification);

module.exports = router;