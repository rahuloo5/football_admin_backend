const mongoose = require('mongoose');
const Post = require('../../db/models/post.model');
const Comment = require('../../db/models/comment.model');
const { validationResult } = require('express-validator');

// Create a new post with image
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, image } = req.body;
    const userId = req.user.id;

    // Create new post with image data
    const newPost = new Post({
      content,
      user: userId,
      image: {
        data: image.data,
        mimeType: image.mimeType || 'image/jpeg',
        width: image.width || 0,
        height: image.height || 0,
        aspectRatio: image.aspectRatio || 1,
        size: image.size || 0
      }
    });

    await newPost.save();
    
    // Populate user data
    const populatedPost = await Post.findById(newPost._id)
      .populate('user', 'username avatar')
      .lean();

    res.status(201).json({
      success: true,
      data: populatedPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating post'
    });
  }
};

// Get all posts with pagination
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username firstname lastname avatar avatarIndex')
      .populate({
        path: 'comments',
        options: { limit: 2 }, // Show 2 recent comments
        populate: {
          path: 'user',
          select: 'username firstname lastname avatar avatarIndex'
        }
      })
      .lean();

    const total = await Post.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching posts'
    });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      })
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching post'
    });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post'
      });
    }

    post.content = content || post.content;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating post'
    });
  }
};

// Delete a post (soft delete)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if the user is the owner of the post or an admin
    if (post.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }

    // Soft delete
    post.isActive = false;
    await post.save();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting post'
    });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Ensure req.user._id exists
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const userId = req.user.id.toString();

    // Check if the post has already been liked by this user
    if (post.likes.some(like => like.user && like.user.toString() === userId)) {
      return res.status(400).json({
        success: false,
        error: 'Post already liked'
      });
    }

    // Add the like with proper user reference
    post.likes.unshift({ user: userId });
    post.likeCount = post.likes.length;
    
    await post.save();

    res.json({
      success: true,
      data: post.likes
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while liking post'
    });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    // Check if the post has been liked
    if (!post.likes.some(like => like.user && like.user.toString() === req.user.id.toString())) {
      return res.status(400).json({
        success: false,
        error: 'Post has not been liked'
      });
    }

    // Remove the like
    post.likes = post.likes.filter(
      like => like.user && like.user.toString() !== req.user.id.toString()
    );
    post.likeCount = post.likes.length;
    await post.save();

    res.json({
      success: true,
      data: post.likes
    });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while unliking post'
    });
  }
};

// Add a comment to a post
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }

    const comment = new Comment({
      content,
      user: req.user.id,
      post: post._id
    });

    await comment.save();
    
    // Add comment to post and increment comment count
    post.comments.push(comment._id);
    post.commentsCount += 1;
    await post.save();

    // Populate user data
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adding comment'
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check if the user is the owner of the comment or an admin
    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    const post = await Post.findById(comment.post);
    
    // Remove comment from post's comments array
    post.comments = post.comments.filter(
      commentId => commentId.toString() !== req.params.commentId
    );
    post.commentsCount = Math.max(0, post.commentsCount - 1);
    await post.save();
    
    // Delete the comment
    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting comment'
    });
  }
};

// Get comments for a post with pagination
const getPostComments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ 
      post: req.params.id,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'username avatar')
    .lean();

    const total = await Comment.countDocuments({ 
      post: req.params.id,
      isActive: true 
    });

    res.json({
      success: true,
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching comments'
    });
  }
};

// Get posts by a specific user
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      user: userId,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'username avatar')
    .populate({
      path: 'comments',
      options: { limit: 2 },
      populate: {
        path: 'user',
        select: 'username avatar'
      }
    })
    .lean();

    const total = await Post.countDocuments({ 
      user: userId,
      isActive: true 
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user posts'
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getPostComments,
  getUserPosts
};
