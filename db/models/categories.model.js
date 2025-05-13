const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String },
    Subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
    },
    icon: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
