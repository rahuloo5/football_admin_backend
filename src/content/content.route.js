const express = require("express");
const {
  getaddcontent,
  deleteContent,
  updateContent,
  getContentById,
  getAllContent,
} = require("./content.controller");

const { authMiddleware } = require("../middleware/authorization.middleware");
const { contentImage } = require("../utility/picture");

const router = express.Router();

//Content API
router.post("/content", contentImage, authMiddleware, getaddcontent);
router.delete("/content/:id", authMiddleware, deleteContent);
router.patch("/content/:id", contentImage, authMiddleware, updateContent);
router.get("/content/:id", authMiddleware, getContentById);
router.get("/content", authMiddleware, getAllContent);

module.exports = router;
