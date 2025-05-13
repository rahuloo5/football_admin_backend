const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    media: {
      type: [String], // Array of media URLs (images, videos)
      default: [],
    },
    comments: [commentSchema],
    likes: [likeSchema],
    commentsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 }); // For user posts queries
postSchema.index({ createdAt: -1 }); // For feed queries
postSchema.index({ "likes.user": 1, _id: 1 }); // For checking if a user liked a post

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
