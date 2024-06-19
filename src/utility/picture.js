const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    req[file.fieldname] = Date.now() + "-" + file.originalname;
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Updated configuration for articleImage route
const articleImageStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const filenameWithoutSpaces = file.originalname.replace(/\s+/g, "");
    cb(null, filenameWithoutSpaces);
  },
});

// Multer instances for different routes
exports.deviceImages = multer({ storage }).any("Images");

exports.contentImage = multer({ storage }).single("image");

exports.articleImage = multer({ storage: articleImageStorage }).fields([
  { name: "Images", maxCount: 1 },
  { name: "description_image", maxCount: 1 },
]);

exports.categoriesImage = multer({ storage }).array("icon");

exports.categoriesIcon = multer({ storage }).array("icon");

exports.subcategoriesImage = multer({ storage }).array("Icons");

exports.upload = multer({ storage });
