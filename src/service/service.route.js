const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { comments } = require("./service.controller");

const router = express.Router();

//search API

// Create
router.post("/comments", authMiddleware, comments);

module.exports = router;
