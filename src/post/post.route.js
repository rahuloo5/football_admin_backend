const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likePost,
  unlikePost,
  getFeed,
  getPostComments,
} = require("./post.controller");

const router = express.Router();

// Post routes
router.post("/posts", authMiddleware, createPost);
router.get("/posts", authMiddleware, getAllPosts);
router.get("/posts/feed", authMiddleware, getFeed);
router.get("/posts/:postId", authMiddleware, getPostById);
router.get("/users/:userId/posts", authMiddleware, getUserPosts);
router.put("/posts/:postId", authMiddleware, updatePost);
router.delete("/posts/:postId", authMiddleware, deletePost);

// Comment routes
router.post("/posts/:postId/comments", authMiddleware, addComment);
router.delete("/posts/:postId/comments/:commentId", authMiddleware, deleteComment);
router.get("/posts/:postId/comments", authMiddleware, getPostComments);

// Like routes
router.post("/posts/:postId/like", authMiddleware, likePost);
router.delete("/posts/:postId/like", authMiddleware, unlikePost);

module.exports = router;
