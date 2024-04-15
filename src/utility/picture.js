const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    console.log(file, req.files);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(file, "file");
    req[file.fieldname] = Date.now() + "-" + file.originalname;
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const iconStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    req.iconName = Date.now() + "-" + file.originalname;
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// for device
// exports.deviceIcons = multer({ iconStorage }).array("Icons");
exports.deviceImages = multer({ storage }).any("Images");

exports.contentImage = multer({ storage }).single("image");
exports.articleImage = multer({ storage }).single("Images");

exports.categoriesImage = multer({ storage }).array("icon");
exports.categoriesIcon = multer({ storage }).array("icon");
exports.subcategoriesImage = multer({ storage }).array("Icons");

exports.upload = multer({ storage: storage });
