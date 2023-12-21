const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },

    heading: {
      type: String,
    },
  },

  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
