const express = require("express");
const {
  userSignup,
  userlogin,
  getalluser,
  deleteduser,
  updateuser,
  getUserById,
  user,
  createuser,
} = require("./user.controller");
const { authMiddleware } = require("../middleware/authorization.middleware");

const router = express.Router();

//auth API
router.post("/signup", userSignup);
router.post("/login", userlogin);

//user API
router.post("/users", authMiddleware, createuser);
router.get("/users", getalluser);
router.get("/users/:id", authMiddleware, getUserById);
router.patch("/users/:id", authMiddleware, updateuser);
router.delete("/users/:id", authMiddleware, deleteduser);

module.exports = router;
