const Content = require("../../db/config/content.model");

// add content
const getaddcontent = async (req, res) => {
  try {
    const { title, description, heading } = req.body;

    const image = req.file ? req?.file?.filename : null;

    const newContent = new Content({ title, description, image, heading });

    await newContent.save();

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update content by ID
const updateContent = async (req, res) => {
  const { id } = req.params;
  const { title, description, heading } = req.body;
  console.log("sdfghjkl", req.body);

  try {
    const updatedContent = await Content.findByIdAndUpdate(
      id,
      { title, description, heading },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(updatedContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete content by ID
const deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContent = await Content.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve content by ID
const getContentById = async (req, res) => {
  const { id } = req.params;

  try {
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllContent = async (req, res) => {
  try {
    const allContent = await Content.find();
    res.status(200).json(allContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getaddcontent,
  deleteContent,
  updateContent,
  getContentById,
  getAllContent,
};
