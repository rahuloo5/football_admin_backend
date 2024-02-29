const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  [
    {
      description: {
        type: String,
      },

      image: {
        type: String,
      },
    },
  ],

  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
