const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { Createfeedback, getallFeedback } = require("./feedback.controller");

const router = express.Router();

//Content API
router.post("/feedback", authMiddleware, Createfeedback);
router.get("/feedback", authMiddleware, getallFeedback);

module.exports = router;
