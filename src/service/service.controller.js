const express = require("express");
const CommentModel = require("../../db/config/service.model");
const router = express.Router();

// Create a new comment
const comments = async (req, res) => {
  try {
    const { message, name, email } = req.body;
    const newComment = new CommentModel({ message, name, email });
    const savedComment = await newComment.save();
    res.status(200).json({ comment: savedComment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = router;

module.exports = {
  comments,
};
