const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["position", "ageGroup", "idealPlayer", "diet","level","content","subcategory","category"],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      unique: true, // to avoid duplicates like two "midfielder"
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContentManage", // refers to another document of type 'subcategory'
      required: function () {
        return false;
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("ContentManage", contentSchema);
