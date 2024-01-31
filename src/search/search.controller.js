const YourModel = require("../../db/config/search.model");
const SchemaValidation = require("./search.dto");

// Create operation

const createItem = async (req, res) => {
  try {
    const { error, value } = SchemaValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedItem = await YourModel.findOneAndUpdate(
      { searchText: value.searchText },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Item count updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Read operation (get all items)

const getAllItems = async (req, res) => {
  const MIN_LIMIT = 10;
  const MAX_LIMIT = 50;

  try {
    let { page, limit, searchText } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || MIN_LIMIT;
    limit = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, limit));
    const skip = (page - 1) * limit;

    const filter = {};
    if (searchText) {
      filter.searchText = new RegExp(searchText, "i");
    }

    const totalCount = await YourModel.countDocuments(filter);

    const items = await YourModel.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      page,
      limit,
      data: items,
      totalCount,
      success: true,
      message: "Items retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Update operation
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { searchText } = req.body;
    const updatedItem = await YourModel.findByIdAndUpdate(
      id,
      { searchText },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete operation

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await YourModel.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Read operation (get item by ID)
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await YourModel.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item retrieved successfully",
      data: item,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  getItemById,
};
