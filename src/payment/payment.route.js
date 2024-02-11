const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { createpayment } = require("./payment.controller");

const router = express.Router();

router.post("/payment", authMiddleware, createpayment);

module.exports = router;
