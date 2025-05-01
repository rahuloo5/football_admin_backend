const express = require("express");
const {
  sendNotification
} = require("./notification.controller");

const router = express.Router();

router.post("/sendNotification", sendNotification);
router.post("/notification", sendNotification);

//fake notification

module.exports = router;
