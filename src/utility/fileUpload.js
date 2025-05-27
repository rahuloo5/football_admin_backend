const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
const pdfDir = path.join(uploadDir, 'pdf');
const videoDir = path.join(uploadDir, 'video');

// Ensure directories exist
[uploadDir, pdfDir, videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type
    let dest = uploadDir;
    
    if (file.mimetype.startsWith('video/')) {
      dest = videoDir;
    } else if (file.mimetype === 'application/pdf') {
      dest = pdfDir;
    }
    
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept only PDF and video files
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and video files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

module.exports = upload;
