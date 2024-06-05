const mongoose = require("mongoose");

const Category = require("../../db/config/categories.model");
const manageDevice = require("../../db/config/devicemanage.model");

// create Category

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log("category data", req.body);
    // const icon = req.file ? req?.file?.filename : null;
    const icon = req.files ? req.files.map((file) => file.filename) : null;
    const cat = await Category.findOne({ name });
    if (cat) {
      res.status(400).json({
        success: false,
        error: "Category already listed by this name",
      });
    } else {
      const newCategory = new Category({
        name,
        icon,
      });

      await newCategory.save();

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    let filter = {};
    if (req.query?.page?.name) {
      filter.name = { $regex: req?.query?.page?.name, $options: "i" };
    }

    const totalCategories = await Category.countDocuments(filter);
    const totalPages = Math.ceil(totalCategories / pageSize);

    const allcategories = await Category.find(filter)
      .skip(startIndex)
      .limit(pageSize);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalCategories: totalCategories,
    };

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: { allcategories, paginationInfo },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get category by ID

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update category by ID

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const data = req.body;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    const icon = req.files
      .filter((item) => item.fieldname === "icon")
      .map((file) => file.filename);
    if (icon.length > 0) {
      console.log(icon);
      data.icon = icon;
    } else {
      data.icon = [data.icon];
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Delete category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }
    const devices = await manageDevice.find({ category: categoryId });
    console.log(devices);
    if (devices.length == 0) {
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      res.status(200).json({ success: true, data: deletedCategory });
    } else {
      return res.status(400).json({
        success: false,
        error: "cannot delete category because device listed on this category",
      });
    }
    // if (!deletedCategory) {
    //   return res
    //     .status(404)
    //     .json({ success: false, error: "Category not found" });
    // }

    // res.status(200).json({ success: true, data: deletedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
