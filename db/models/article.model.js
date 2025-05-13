const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    short_description: {
      type: String,
    },
    long_description: {
      type: String,
    },
    description_image: {
      type: [String]
    },
    Images: {
      type: String,
    },
  },

  { timestamps: true }
);

const Article = mongoose.model("article", articleSchema);

module.exports = Article;
