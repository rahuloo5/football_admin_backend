const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { getaddscreen, getAllscreen } = require("./screen.controller");
const { screenImage } = require("../utility/picture");

const router = express.Router();

//Content API
router.post("/screen", screenImage, getaddscreen);
router.get("/screen", getAllscreen);

module.exports = router;
