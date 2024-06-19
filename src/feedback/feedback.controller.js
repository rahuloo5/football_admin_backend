const Feedback = require("../../db/config/feedback.model");

// Create feedback
const Createfeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all feedback
const getallFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getallFeedback,
  Createfeedback,
};
