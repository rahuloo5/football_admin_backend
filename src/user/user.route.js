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

module.exports = router;
