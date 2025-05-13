const mongoose = require("mongoose");
const Post = require("../../db/models/post.model");
const User = require("../../db/models/user.model");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { description, image } = req.body;
    const userId = req.user.id;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const newPost = new Post({
      user: userId,
      content: description,
      media: image ? [image] : [],
    });

    const savedPost = await newPost.save();
    
    // Populate user information
    const populatedPost = await Post.findById(savedPost._id)
      .populate({
        path: "user",
        select: "firstname lastname email"
      });

    res.status(201).json({
      message: "Post created successfully",
      data: populatedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all posts (with cursor-based pagination)
const getAllPosts = async (req, res) => {
  try {
    const { limit = 10, cursor } = req.query;
    const parsedLimit = parseInt(limit);
    const query = {};
    
    // If cursor is provided, fetch posts with IDs less than the cursor
    if (cursor) {
      query._id = { $lt: cursor };
    }

    // Fetch one extra post to determine if there are more posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit + 1)
      .populate({
        path: "user",
        select: "firstname lastname email"
      });

    // Check if there are more posts
    const hasMore = posts.length > parsedLimit;
    // Remove the extra post if there are more
    const results = hasMore ? posts.slice(0, parsedLimit) : posts;
    // Get the ID of the last post to use as the next cursor
    const nextCursor = hasMore && results.length > 0 ? results[results.length - 1]._id : null;

    res.status(200).json({
      message: "Posts fetched successfully",
      data: results,
      pagination: {
        nextCursor: nextCursor ? nextCursor.toString() : null,
        hasMore
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get posts by user ID (with cursor-based pagination)
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, cursor } = req.query;
    const parsedLimit = parseInt(limit);
    
    const query = { user: userId };
    
    // If cursor is provided, fetch posts with IDs less than the cursor
    if (cursor) {
      query._id = { $lt: cursor };
    }

    // Fetch one extra post to determine if there are more posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit + 1)
      .populate({
        path: "user",
        select: "firstname lastname email"
      });

    // Check if there are more posts
    const hasMore = posts.length > parsedLimit;
    // Remove the extra post if there are more
    const results = hasMore ? posts.slice(0, parsedLimit) : posts;
    // Get the ID of the last post to use as the next cursor
    const nextCursor = hasMore && results.length > 0 ? results[results.length - 1]._id : null;

    res.status(200).json({
      message: "User posts fetched successfully",
      data: results,
      pagination: {
        nextCursor: nextCursor ? nextCursor.toString() : null,
        hasMore
      },
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate({
        path: "user",
        select: "firstname lastname email"
      });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { description, image } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this post" });
    }

    const updateData = {};
    if (description) updateData.content = description;
    if (image) updateData.media = [image];

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true }
    ).populate({
      path: "user",
      select: "firstname lastname email"
    });

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a comment to a post using atomic operations
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    // Check if post exists
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Use atomic operations to add the comment and increment the count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { 
        $push: { comments: comment },
        $inc: { commentsCount: 1 }
      },
      { new: true }
    ).populate({
      path: "user",
      select: "firstname lastname email"
    });

    // Get user info for the new comment
    const user = await User.findById(userId).select("firstname lastname email");

    // Return just the new comment with user info instead of the entire post
    const commentWithUser = {
      ...comment.toObject ? comment.toObject() : comment,
      user
    };

    res.status(201).json({
      message: "Comment added successfully",
      data: commentWithUser,
      postId: updatedPost._id,
      commentsCount: updatedPost.commentsCount
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment using atomic operations
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    // First check if the user is authorized to delete the comment
    const post = await Post.findOne(
      { _id: postId, "comments._id": commentId },
      { "comments.$": 1, user: 1 }
    );

    if (!post) {
      return res.status(404).json({ error: "Post or comment not found" });
    }

    const comment = post.comments[0];

    // Check if the user is the owner of the comment or the post
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    // Use atomic operations to remove the comment and decrement the count
    await Post.updateOne(
      { _id: postId },
      { 
        $pull: { comments: { _id: commentId } },
        $inc: { commentsCount: -1 }
      }
    );

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like a post using atomic operations
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Use findOneAndUpdate with atomic operations
    // This is more efficient than fetching, modifying, and saving
    const result = await Post.findOneAndUpdate(
      { 
        _id: postId,
        "likes.user": { $ne: userId } // Make sure user hasn't already liked
      },
      { 
        $push: { likes: { user: userId, createdAt: new Date() } },
        $inc: { likesCount: 1 }
      },
      { new: true }
    );

    if (!result) {
      // Either post not found or already liked
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(400).json({ error: "You have already liked this post" });
    }

    res.status(200).json({
      message: "Post liked successfully",
      likesCount: result.likesCount,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unlike a post using atomic operations
const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Use findOneAndUpdate with atomic operations
    // This is more efficient than fetching, modifying, and saving
    const result = await Post.findOneAndUpdate(
      { 
        _id: postId,
        "likes.user": userId // Make sure user has liked the post
      },
      { 
        $pull: { likes: { user: userId } },
        $inc: { likesCount: -1 }
      },
      { new: true }
    );

    if (!result) {
      // Either post not found or not liked
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.status(400).json({ error: "You have not liked this post" });
    }

    res.status(200).json({
      message: "Post unliked successfully",
      likesCount: result.likesCount,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get feed for a user (posts from community) with cursor-based pagination
const getFeed = async (req, res) => {
  try {
    const { limit = 10, cursor } = req.query;
    const parsedLimit = parseInt(limit);
    const query = {};
    
    // If cursor is provided, fetch posts with IDs less than the cursor
    if (cursor) {
      query._id = { $lt: cursor };
    }

    // Fetch one extra post to determine if there are more posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parsedLimit + 1)
      .populate({
        path: "user",
        select: "firstname lastname email"
      })
      // Don't populate all comments, just return the count
      // This significantly reduces response payload size
      .select("-comments");

    // Check if there are more posts
    const hasMore = posts.length > parsedLimit;
    // Remove the extra post if there are more
    const results = hasMore ? posts.slice(0, parsedLimit) : posts;
    // Get the ID of the last post to use as the next cursor
    const nextCursor = hasMore && results.length > 0 ? results[results.length - 1]._id : null;

    res.status(200).json({
      message: "Feed fetched successfully",
      data: results,
      pagination: {
        nextCursor: nextCursor ? nextCursor.toString() : null,
        hasMore
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get comments for a post with pagination
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { limit = 10, cursor } = req.query;
    const parsedLimit = parseInt(limit);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let comments = [];
    let hasMore = false;
    let nextCursor = null;

    if (post.comments && post.comments.length > 0) {
      // Sort comments by creation date (newest first)
      const sortedComments = [...post.comments].sort((a, b) => 
        b.createdAt - a.createdAt
      );

      // Apply cursor-based pagination
      let startIndex = 0;
      if (cursor) {
        startIndex = sortedComments.findIndex(comment => 
          comment._id.toString() === cursor
        );
        if (startIndex !== -1) {
          // Start after the cursor
          startIndex += 1;
        } else {
          startIndex = 0;
        }
      }

      // Get comments for the current page
      const endIndex = startIndex + parsedLimit;
      const pageComments = sortedComments.slice(startIndex, endIndex + 1);
      
      // Check if there are more comments
      hasMore = pageComments.length > parsedLimit;
      // Remove the extra comment if there are more
      comments = hasMore ? pageComments.slice(0, parsedLimit) : pageComments;
      // Get the ID of the last comment to use as the next cursor
      nextCursor = hasMore && comments.length > 0 ? comments[comments.length - 1]._id : null;

      // Get user IDs from comments
      const userIds = comments.map(comment => comment.user);
      
      // Fetch user information in a single query
      const users = await User.find({ _id: { $in: userIds } })
        .select("firstname lastname email");

      // Create a map of user IDs to user objects
      const userMap = {};
      users.forEach(user => {
        userMap[user._id.toString()] = user;
      });

      // Add user information to comments
      comments = comments.map(comment => {
        const commentObj = comment.toObject();
        commentObj.user = userMap[comment.user.toString()];
        return commentObj;
      });
    }

    res.status(200).json({
      message: "Comments fetched successfully",
      data: comments,
      pagination: {
        nextCursor: nextCursor ? nextCursor.toString() : null,
        hasMore,
        total: post.commentsCount
      }
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
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
};
