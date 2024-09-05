const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createComment,
  getComment,
  updateComment,
} = require("./contactUs.controller");

const router = express.Router();

//Content API
router.post("/contact_us", authMiddleware, createComment);
router.get("/contact_us", authMiddleware, getComment);
router.put("/contact_us/:id", authMiddleware, updateComment);

module.exports = router;
