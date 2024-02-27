const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { subscriptionWebhook } = require("./sub.controller");

const router = express.Router();

//webhook api

router.post("/webhook", subscriptionWebhook);

module.exports = router;
