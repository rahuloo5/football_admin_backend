const express = require("express");
const {
  sendNotification,getNotification
} = require("./notification.controller");

const router = express.Router();

router.post("/sendNotification", sendNotification);
router.post("/notification", getNotification);

//fake notification

module.exports = router;
