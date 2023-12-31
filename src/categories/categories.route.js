const express = require("express");

const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("./categories.controller");
const {
  createSubCategory,
  getallsubcategory,
  deletesubcategory,
} = require("./categories-sub.controller");

const router = express.Router();

//categories API

router.post("/categories", authMiddleware, createCategory);

router.get("/categories", authMiddleware, getAllCategories);

router.get("/categories/:id", authMiddleware, getCategoryById);

router.patch("/categories/:id", authMiddleware, updateCategory);

router.delete("/categories/:id", authMiddleware, deleteCategory);

//sub_categories API
router.post("/subcategories", authMiddleware, createSubCategory);
router.get("/subcategories", getallsubcategory);
router.delete("/subcategories/:id", authMiddleware, deletesubcategory);

module.exports = router;
