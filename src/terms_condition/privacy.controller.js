const Terms = require("../../db/config/terms_condition.model");

// Create feedback
const CreateTerms = async (req, res) => {
  try {
    const terms = new Terms(req.body);
    await terms.save();
    res.status(201).json(terms);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all feedback
const getTerms = async (req, res) => {
  try {
    const terms = await Terms.find();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTerms = async (req, res) => {
  try {
    const updatedTerms = await Terms.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTerms) {
      return res.status(404).json({ message: "Terms not found" });
    }
    return res.json({
      message: "Terms updated successfully",
      updatedTerms,
    });
  } catch (error) {
    console.error("Error in updating:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateTerms,
  getTerms,
  updateTerms,
};
