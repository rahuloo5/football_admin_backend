const YourModel = require("../../db/config/search.model");
const Plan = require("../../db/config/plan.model");
const SchemaValidation = require("./search.dto");

// Create operation

const addCount = async (req, res) => {
  try {
    const userId = req.user;
    const [updatedItem, getPlanByUser] = await Promise.all([
      YourModel.findOne({ userId }).lean(),
      Plan.findOne({ user: userId })
        .populate("subscription", "planName numberOfSearchAllowed end_date")
        .lean(),
    ]);
    if (!getPlanByUser?.subscription) {
      return res.status(400).json({
        success: false,
        message: "No subscription found for the user",
      });
    }

    const { planName, _id, numberOfSearchAllowed } = getPlanByUser.subscription;
    const currentDate = new Date();

    if (planName === "Free") {
      if (updatedItem?.count >= numberOfSearchAllowed) {
        const plan = {
          planName,
          plandId: _id,
          count: 0,
        };
        return res.status(200).json({
          success: true,
          message: "Maximum usage reached for Free plan",
          data: plan,
        });
      }
      await YourModel.findOneAndUpdate(
        { userId },
        { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
        { new: true, upsert: true }
      );
      return res.status(200).json({
        success: true,
        message: "Item count updated successfully",
        data: {
          planName,
          plandId: _id,
          count: parseInt(updatedItem?.count),
        },
      });
    } else if (planName === "Monthly" || planName === "Yearly") {
      if (new Date(getPlanByUser?.end_date) < currentDate) {
        const plan = {
          planName,
          plandId: _id,
          count: 0,
        };
        return res.status(403).json({
          success: false,
          message: `${planName} plan has expired`,
          data: plan,
        });
      }
      await YourModel.findOneAndUpdate(
        { userId },
        { $inc: { count: 1 }, $setOnInsert: { createdAt: new Date() } },
        { new: true, upsert: true }
      );
      const plan = {
        planName,
        planId: _id,
        count: -1,
      };
      return res.status(200).json({
        success: true,
        message: "Item count updated successfully",
        data: plan,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan type" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getCount = async (req, res) => {
  try {
    const userId = req.user;

    const [updatedItem, getPlanByUser] = await Promise.all([
      YourModel.findOne({ userId }).lean(),
      Plan.findOne({ user: userId })
        .populate("subscription", "planName numberOfSearchAllowed end_date")
        .lean(),
    ]);

    let currentItem = updatedItem;
    if (!updatedItem) {
      currentItem = await YourModel.create({
        userId,
        count: 0,
        createdAt: new Date(),
      });
    }

    if (!getPlanByUser?.subscription) {
      return res.status(400).json({
        success: false,
        message: "No subscription found for the user",
      });
    }

    const {
      planName,
      _id: planId,
      numberOfSearchAllowed,
    } = getPlanByUser.subscription;
    const currentDate = new Date();

    if (planName === "Free") {
      if (currentItem.count >= numberOfSearchAllowed) {
        return res.status(200).json({
          success: true,
          message: "Maximum usage reached for Free plan",
          data: {
            planName,
            planId,
            count: 0,
          },
        });
      }
      return res.status(200).json({
        success: true,
        message: "Item count retrieved successfully",
        data: {
          planName,
          planId,
          count: numberOfSearchAllowed - currentItem.count,
        },
      });
    } else if (planName === "Monthly" || planName === "Yearly") {
      if (new Date(getPlanByUser.end_date) < currentDate) {
        return res.status(403).json({
          success: false,
          message: `${planName} plan has expired`,
          data: {
            planName,
            planId,
            count: 0,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item count retrieved successfully",
        data: {
          planName,
          planId,
          count: -1, // Unlimited usage (count not restricted)
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
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
  addCount,
  getCount,
  getAllItems,
  updateItem,
  deleteItem,
  getItemById,
};
