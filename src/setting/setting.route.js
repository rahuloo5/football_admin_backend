const express = require("express");
const {
  getWelcomeMail,
  updateWelecomeMail,
} = require("./setting.controller");

const router = express.Router();

router.post("/welcomeMail", updateWelecomeMail);

router.get("/welcomeMail", getWelcomeMail);

module.exports = router;