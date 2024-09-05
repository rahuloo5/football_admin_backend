const ContactUs = require("../../db/config/contact_us.model");

// Create feedback
const createComment = async (req, res) => {
  try {
    const comment = new ContactUs(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all feedback
const getComment = async (req, res) => {
  try {
    const comment = await ContactUs.find();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const updatedComment = await ContactUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json({
      message: "Privacy policy updated successfully",
      updatedComment,
    });
  } catch (error) {
    console.error("Error in updating:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createComment,
  getComment,
  updateComment,
};
