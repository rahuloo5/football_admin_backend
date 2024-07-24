const sanitizeHtml = require("sanitize-html");

const Article = require("../../db/config/article.model");

const getaddArticle = async (req, res) => {
  try {
    const { short_description, long_description } = req.body;

    // Accessing uploaded files from req.files
    const Images = req.files['Images'] ? req.files['Images'][0].filename : "";
    const description_images = req.files['description_image[]'] ? req.files['description_image[]'].map(file => file.filename) : [];

    const newArticle = new Article({
      short_description,
      long_description,
      description_image: description_images,
      Images,
    });

    await newArticle.save();

    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// const getaddArticle = async (req, res) => {
//   try {
//     const { short_description, long_description } = req.body;

//     console.log("article data", req.body);

//     const Images = req.file ? req?.file?.filename : "";

//     const newArticle = new Article({
//       short_description,
//       long_description,
//       Images,
//     });
//     console.log("newArticledata", newArticle);

//     await newArticle.save();

//     res.status(201).json(newArticle);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// Get all article

const getAllArticle = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    let query = {};
      if (req.query?.page?.short_description) {
        query.short_description = { $regex: req?.query?.page?.short_description, $options: 'i' };
      }
      if (req.query?.page?.detail_description) {
        query.long_description = { $regex: req?.query?.page?.detail_description, $options: 'i' };
      }

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / pageSize);

    const articles = await Article.find(query).skip(startIndex).limit(pageSize);
    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalArticles: totalArticles,
    };

    res.status(200).json({ articles, paginationInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an article by ID
// const updateArticle = async (req, res) => {
//   try {
//     const { short_description, long_description } = req.body;
//     const Images = req.file ? req.file.filename : null;
//     // const Images = req.file ? req.file.filename : null;

//     const updatedArticle = await Article.findByIdAndUpdate(
//       req.params.id,
//       { short_description, long_description, Images },
//       { new: true }
//     );

//     console.log("update", updatedArticle);

//     if (!updatedArticle) {
//       return res.status(404).json({ error: "Article not found" });
//     }

//     res.status(200).json({
//       message: "Article updated successfully",
//       article: updatedArticle,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const updateArticle = async (req, res) => {
  try {
    const { short_description, long_description } = req.body;
    const new_description_image = req.files['new_description_image[]'] ? req.files['new_description_image[]']?.map(file => file.filename) : req.body?.new_description_image;
    const Images = req.files['Images'] ? req.files['Images'][0].filename : null;
    const description_images = req.files['description_image[]'] ? req.files['description_image[]'].map(file => file.filename) : [];
    
    const updateData = { short_description };
    if (long_description) updateData.long_description = long_description;
    if (Images) updateData.Images = Images;
    if (description_images.length >= 0) updateData.description_image = [
      ...description_images,
      ...new_description_image
    ];
    
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );     

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      article: updatedArticle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getaddArticle,
  getAllArticle,
  deleteArticle,
  getArticleById,
  updateArticle,
};
