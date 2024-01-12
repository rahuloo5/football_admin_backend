const express = require("express");
const {
  userSignup,
  userlogin,
  getalluser,
  deleteduser,
  updateuser,
  getUserById,
  user,
} = require("./user.controller");
const { authMiddleware } = require("../middleware/authorization.middleware");

const router = express.Router();

//auth API
router.post("/signup", userSignup);
router.post("/login", userlogin);

//user API
router.get("/user", getalluser);
router.post("/user", authMiddleware, user);
router.delete("/user/:id", authMiddleware, deleteduser);
router.patch("/user/:id", authMiddleware, updateuser);
router.get("/user/:id", authMiddleware, getUserById);

module.exports = router;
