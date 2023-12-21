const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    created_at: {
      type: Number,
    },
    category_name: {
      type: String,
    },
    sub_category: {
      type: String,
    },
  },

  { timestamps: true }
);

const categories = mongoose.model("categories", categoriesSchema);

module.exports = categories;
