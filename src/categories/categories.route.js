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
const { categoriesImage, subcategoriesImage } = require("../utility/picture");

const router = express.Router();

//categories API

router.post("/categories", authMiddleware, categoriesImage, createCategory);

router.get("/categories", authMiddleware, getAllCategories);

router.get("/categories/:categoryId", authMiddleware, getCategoryById);

router.patch(
  "/categories/:categoryId",
  authMiddleware,
  categoriesImage,
  updateCategory
);

router.delete("/categories/:categoryId", authMiddleware, deleteCategory);

//sub_categories API
router.post(
  "/subcategories",
  authMiddleware,
  subcategoriesImage,
  createSubCategory
);
router.get("/subcategories", getallsubcategory);
router.delete(
  "/subcategories/:subcategoryId",
  authMiddleware,
  deletesubcategory
);

module.exports = router;
