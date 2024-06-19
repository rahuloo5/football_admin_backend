const Content = require("../../db/config/content.model");
const { contentValidationSchema } = require("./content.dto");

// add content
const getaddcontent = async (req, res) => {
  try {
    const { error } = contentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { description } = req.body;

    const image = req.file ? req.file.filename : null;

    const newContent = new Content({
      description,
      image,
    });

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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const totalContent = await Content.countDocuments();
    const totalPages = Math.ceil(totalContent / pageSize);

    const content = await Content.find().skip(startIndex).limit(pageSize);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalContent: totalContent,
    };

    res.status(200).json({ content, paginationInfo });
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
