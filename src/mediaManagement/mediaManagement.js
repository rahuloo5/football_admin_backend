const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Define allowed file types and their corresponding directories
const ALLOWED_FILE_TYPES = {
    'application/pdf': 'pdf',
    'video/mp4': 'video',
    'video/quicktime': 'video',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image'
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = ALLOWED_FILE_TYPES[file.mimetype];
        if (!fileType) {
            return cb(new Error('Invalid file type'));
        }
        const uploadPath = path.join(__dirname, '../../uploads', fileType);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        const uploadPath = path.join(__dirname, '../../uploads', ALLOWED_FILE_TYPES[file.mimetype]);
        const filePath = path.join(uploadPath, originalName);

        // If file with same name exists, add timestamp prefix
        if (fs.existsSync(filePath)) {
            const timestamp = Date.now();
            const ext = path.extname(originalName);
            const nameWithoutExt = path.basename(originalName, ext);
            cb(null, `${nameWithoutExt}_${timestamp}${ext}`);
        } else {
            cb(null, originalName);
        }
    }
});

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (ALLOWED_FILE_TYPES[file.mimetype]) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Function to get all media contents
const getMediaContents = () => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    const mediaContents = [];

    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
        return mediaContents;
    }

    // Read all subdirectories in uploads
    const subDirs = fs.readdirSync(uploadsDir);

    subDirs.forEach(dir => {
        const dirPath = path.join(uploadsDir, dir);
        if (fs.statSync(dirPath).isDirectory()) {
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                mediaContents.push(`${dir}/${file}`);
            });
        }
    });

    return mediaContents;
};

// Function to add media contents
const addMediaContents = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.array('files')(req, res, (err) => {
            if (err) {
                reject(err);
                return;
            }

            const uploadedFiles = req.files.map(file => {
                const fileType = ALLOWED_FILE_TYPES[file.mimetype];
                return `${fileType}/${file.filename}`;
            });

            resolve(uploadedFiles);
        });
    });
};

module.exports = {
    getMediaContents,
    addMediaContents,
    upload
}; 