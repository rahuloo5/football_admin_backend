const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
    },

    User: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
