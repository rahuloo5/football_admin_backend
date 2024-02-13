const express = require("express");
const {
  userSignup,
  userlogin,
  deleteduser,
  updateuser,
  getUserById,
  createuser,
  getAllUsers,
  deleteUser,
  createUserplan,
  createsub,
} = require("./user.controller");
const { authMiddleware } = require("../middleware/authorization.middleware");

const router = express.Router();

//auth API
router.post("/signup", userSignup);
router.post("/login", userlogin);

//user API
router.post("/users", authMiddleware, createuser);
router.get("/users", getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.patch("/users/:id", authMiddleware, updateuser);
router.delete("/users/:id", authMiddleware, deleteUser);

// User plan API
router.post("/users-plan", authMiddleware, createUserplan);
router.post("/create-subscription", authMiddleware, createsub);

module.exports = router;
