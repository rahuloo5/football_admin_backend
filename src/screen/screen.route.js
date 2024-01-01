const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { getaddscreen, getAllscreen } = require("./screen.controller");
const { screenImage } = require("../utility/picture");

const router = express.Router();

//Content API
router.post("/screen", screenImage, authMiddleware, getaddscreen);
router.get("/screen", authMiddleware, getAllscreen);

module.exports = router;
