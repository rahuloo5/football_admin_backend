const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.contentImage = multer({ storage }).array("image");
// exports.screenImage = multer({ storage }).single("screen_image");
// exports.bgImage = multer({ storage }).single("bg_image");
exports.articleImage = multer({ storage }).single("Images");

exports.categoriesImage = multer({ storage }).array("icon");
exports.categoriesIcon = multer({ storage }).array("icon");
exports.subcategoriesImage = multer({ storage }).array("Icons");
exports.upload = multer({ storage: storage });
