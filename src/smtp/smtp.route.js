const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { createsmtp, getallsmtp } = require("./smtp.controller");

const router = express.Router();

//smtp API

// Create
router.post("/smtp", authMiddleware, createsmtp);
router.get("/smtp", authMiddleware, getallsmtp);

module.exports = router;
