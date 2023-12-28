// Create a new category

const Category = require("../../db/config/categories.model");

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    console.log("ertyuio", req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const allcategories = await Category.find();

    res.status(200).json(allcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await categories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update category by ID
const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categories.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete category by ID
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categories.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
