const express = require("express");
const {
  createnotification,
  notification,
  allnotification,
} = require("./notification.controller");

const router = express.Router();

// router.post("/send-push-notification", createnotification);

//fake notification

router.post("/notification", notification);
router.get("/notification", allnotification);

module.exports = router;
