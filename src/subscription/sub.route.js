const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { subscriptionWebhook } = require("./sub.controller");

const router = express.Router();

//webhook api

router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  subscriptionWebhook
);

module.exports = router;
