const express = require('express');
const { authMiddleware } = require('../middleware/authorization.middleware');
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
  getPostComments,
} = require('./post.controller');

const router = express.Router();

// Post routes
router.post('/posts',authMiddleware, createPost);
router.get('/posts', authMiddleware, getAllPosts);
router.get('/posts/:id', authMiddleware, getPostById);
router.get('/users/:userId/posts', authMiddleware, getUserPosts);
router.put('/posts/:id', authMiddleware, updatePost);
router.delete('/posts/:id', authMiddleware, deletePost);

// Comment routes
router.post('/posts/:id/comments', authMiddleware, addComment);
router.delete('/posts/:id/comments/:commentId', authMiddleware, deleteComment);
router.get('/posts/:id/comments', authMiddleware, getPostComments);

// Like routes
router.post('/posts/:id/like', authMiddleware, likePost);
router.delete('/posts/:id/like', authMiddleware, unlikePost);

module.exports = router;
