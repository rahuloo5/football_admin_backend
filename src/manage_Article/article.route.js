const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { articleImage } = require("../utility/picture");
const { updateArticleImage } = require("../utility/picture");
const {
  getaddArticle,
  getAllArticle,
  deleteArticle,
  getArticleById,
  updateArticle,
} = require("./article.controller");

const router = express.Router();

// device API
router.post("/article", articleImage, getaddArticle);
router.get("/article", getAllArticle);
router.get("/article/:id", authMiddleware, getArticleById);
router.patch("/article/:id", updateArticleImage, authMiddleware, updateArticle);
router.delete("/article/:id", authMiddleware, deleteArticle);

module.exports = router;
