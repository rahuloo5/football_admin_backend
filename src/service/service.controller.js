const express = require("express");
const mongoose = require("mongoose");
const CommentModel = require("../../db/config/service.model");
const User = require("../../db/config/user.model");
const router = express.Router();

// Create a commen
const createComments = async (req, res) => {
  try {
    const { comment, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const newComment = new Comment({
      comment,
      user: userId,
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Get all comments
const getallcomments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("User");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a comment by ID
router.get("/comments/:id", async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id).populate("user");
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a comment by ID
router.put("/comments/:id", async (req, res) => {
  try {
    const { userId, comment } = req.body;

    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      { user: userId, comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a comment by ID
router.delete("/comments/:id", async (req, res) => {
  try {
    const deletedComment = await CommentModel.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createComments,
  getallcomments,
};
