const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    sub_category: { type: String, required: true },
    Icons: [{ type: String, required: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
