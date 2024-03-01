const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createsmtp,
  getallsmtp,
  updatesmtp,
  deletesmtp,
} = require("./smtp.controller");

const router = express.Router();

//smtp API

router.post("/smtp", authMiddleware, createsmtp);
router.get("/smtp", authMiddleware, getallsmtp);
router.put("/smtp/:id", authMiddleware, updatesmtp);
router.delete("/smtp/:id", authMiddleware, deletesmtp);

module.exports = router;
