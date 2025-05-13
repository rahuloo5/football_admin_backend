const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
