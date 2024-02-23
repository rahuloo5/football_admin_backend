const mongoose = require("mongoose");
const Category = require("../../db/config/categories.model");
const Subcategory = require("../../db/sub_categories.model");

// Create a subcategory

const createSubCategory = async (req, res) => {
  try {
    const { sub_category, categoryId } = req.body;

    // const Icons = req.file ? req.file.filename : null;
    const Icons = req.files ? req.files.map((file) => file.filename) : null;

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

    const newSubcategory = new Subcategory({
      sub_category,
      Icons,
      category: categoryId,
    });

    await newSubcategory.save();

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: newSubcategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//get allsubcategory

const getallsubcategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;

    let filter = {};

    if (req.query.categoryId) {
      filter.category = req.query.categoryId;
    }

    if (req.query.subcategoryId) {
      filter.subcategory = req.query.subcategoryId;
    }

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.sub_category) {
      filter.sub_category = { $regex: req.query.sub_category, $options: "i" };
    }

    const totalSubcategories = await Subcategory.countDocuments(filter);
    const totalPages = Math.ceil(totalSubcategories / pageSize);

    const data = await Subcategory.find(filter)
      .populate("category")
      .skip(startIndex)
      .limit(pageSize);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalSubcategories: totalSubcategories,
    };

    res.status(200).json({ data, paginationInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletesubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid subcategory ID" });
    }
    console.log("subsubcategory", subcategoryId);
    const deletedSubcategory = await Subcategory.findByIdAndDelete(
      subcategoryId
    );

    if (!deletedSubcategory) {
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    }

    res.status(200).json({ success: true, data: deletedSubcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createSubCategory,
  getallsubcategory,
  deletesubcategory,
};
