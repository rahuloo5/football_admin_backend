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

exports.contentImage = multer({ storage }).single("image");
exports.screenImage = multer({ storage }).single("screen_image");
exports.deviceImage = multer({ storage }).array("Images");
exports.articleImage = multer({ storage }).single("Images");
