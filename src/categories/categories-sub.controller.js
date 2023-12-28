const Subcategory = require("../../db/sub_categories.model");

// Create a subcategory
const createSubCategory = async (req, res) => {
  try {
    const { sub_category, categoryId } = req.body;
    const subcategory = new Subcategory({ sub_category, category: categoryId });
    await subcategory.save();
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getallsubcategory = async (req, res) => {
  try {
    const allsub = await Subcategory.find({}).populate("category");
    if (allsub) {
      return res.json({
        rows: allsub,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deletesubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;

    const subcategory = await Subcategory.findById(subcategoryId);
    console.log("aertyuiqwert", subcategory);
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }
    await Subcategory.findByIdAndDelete(subcategoryId);

    res.json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createSubCategory,
  getallsubcategory,
  deletesubcategory,
};
