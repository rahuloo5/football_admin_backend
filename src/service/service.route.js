const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createcomments,
  getallcomments,
  createComments,
} = require("./service.controller");

const router = express.Router();

//search API

// Create
router.post("/comments", authMiddleware, createComments);

// // // Read
router.get("/comments", authMiddleware, getallcomments);

module.exports = router;
