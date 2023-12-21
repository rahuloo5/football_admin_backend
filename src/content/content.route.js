const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const router = express.Router();

//Content API
router.get("/user", getalluser);

module.exports = router;
