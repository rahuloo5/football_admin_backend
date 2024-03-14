const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { updateTwilio, getTwilioDetails } = require("./twilio.controller");

const router = express.Router();

router.post("/update-twilio", authMiddleware, updateTwilio);
router.get("/twilio", authMiddleware, getTwilioDetails);

module.exports = router;
