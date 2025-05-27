const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure storage for course content files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/courses');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filter function to validate file types
const fileFilter = (req, file, cb) => {
  // Accept videos and PDFs
  if (file.mimetype === 'application/pdf' || 
      file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and video files are allowed'), false);
  }
};

// Configure multer for course content uploads
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB file size limit
  }
});

// Configure storage for course thumbnails
const thumbnailStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/thumbnails');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'thumbnail-' + uniqueSuffix + extension);
  }
});

// Filter function to validate thumbnail file types
const thumbnailFileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for thumbnails'), false);
  }
};

// Configure multer for thumbnail uploads
const thumbnailUpload = multer({ 
  storage: thumbnailStorage,
  fileFilter: thumbnailFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit for thumbnails
  }
});

// Handle course content file upload
const uploadCourseContent = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return the file path relative to uploads directory
    const filePath = `courses/${path.basename(req.file.path)}`;
    
    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: filePath,
      fileType: req.file.mimetype.startsWith('video/') ? 'video' : 'pdf'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file', error: error.message });
  }
};

// Handle course thumbnail upload
const uploadCourseThumbnail = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No thumbnail uploaded' });
    }
    
    // Return the file path relative to uploads directory
    const thumbnailPath = `thumbnails/${path.basename(req.file.path)}`;
    
    res.status(200).json({
      message: 'Thumbnail uploaded successfully',
      thumbnailPath: thumbnailPath
    });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    res.status(500).json({ message: 'Failed to upload thumbnail', error: error.message });
  }
};

module.exports = {
  upload,
  thumbnailUpload,
  uploadCourseContent,
  uploadCourseThumbnail
};
