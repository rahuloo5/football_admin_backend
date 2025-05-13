const PrivacyPolicy = require("../../db/models/privacy_policy.model");

// Create feedback
const CreatePolicy = async (req, res) => {
  try {
    const policy = new PrivacyPolicy(req.body);
    await policy.save();
    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all feedback
const getPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.find();
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get feedback by id
const getPolicyById = async (req, res) => {
  try {
    const id = req.params?.id;
    console.log("id", id);
    const policy = await PrivacyPolicy.findById(id);
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const updatedPolicy = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedPolicy) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json({
      message: "Privacy policy updated successfully",
      updatedPolicy,
    });
  } catch (error) {
    console.error("Error in updating:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const deletePolicy = await PrivacyPolicy.findByIdAndDelete(req.params.id);
    if (!deletePolicy) {
      return res.status(404).json({ message: "Privacy policy not found" });
    }
    res.status(200).json({ message: "Policy deleted successfully" });
  } catch (error) {
    console.error("Error in deleteing:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreatePolicy,
  getPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
};
