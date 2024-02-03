const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { getaddscreen, getAllscreen } = require("./screen.controller");
const { upload } = require("../utility/picture");

const router = express.Router();

//Content API
router.post(
  "/screen",
  upload.fields([{ name: "screen_image" }, { name: "bg_image" }]),
  getaddscreen
);
router.get("/screen", getAllscreen);

module.exports = router;
