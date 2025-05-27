const path = require("path");
const fs = require("fs");

// Serve course content files (PDF/video)
const serveCourseContent = (req, res) => {
  try {
    // Get the full filepath from the request params
    const filepath = req.params.filepath;
    
    // Construct the file path
    const filePath = path.join(__dirname, "../../../uploads/", filepath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Set appropriate content type based on file extension
    const ext = path.extname(filepath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader("Content-Type", "application/pdf");
    } else if (ext === '.mp4') {
      res.setHeader("Content-Type", "video/mp4");
    } else if (ext === '.webm') {
      res.setHeader("Content-Type", "video/webm");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }
    
    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving course content:", error);
    res.status(500).json({ message: "Error serving course content", error: error.message });
  }
};

// Serve course thumbnail images
const serveCourseThumbnail = (req, res) => {
  try {
    const { filename } = req.params;
    
    // Construct the file path
    const filePath = path.join(__dirname, "../../../uploads/thumbnails", filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }
    
    // Set appropriate content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (ext === '.png') {
      res.setHeader("Content-Type", "image/png");
    } else if (ext === '.gif') {
      res.setHeader("Content-Type", "image/gif");
    } else if (ext === '.webp') {
      res.setHeader("Content-Type", "image/webp");
    } else {
      res.setHeader("Content-Type", "image/jpeg"); // Default to jpeg
    }
    
    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error serving course thumbnail:", error);
    res.status(500).json({ message: "Error serving course thumbnail", error: error.message });
  }
};

module.exports = {
  serveCourseContent,
  serveCourseThumbnail
};
