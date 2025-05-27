/**
 * Helper functions for working with uploaded files
 */
const path = require('path');
const fs = require('fs');

/**
 * Generate a public URL for accessing a file
 * @param {string} filePath - The file path from the database
 * @param {string} baseUrl - The base URL of the server (optional)
 * @returns {string} The public URL for the file
 */
const getFileUrl = (filePath, baseUrl = '') => {
  if (!filePath) return null;
  
  // Extract the file type (pdf or video) and filename
  const uploadDir = path.join(__dirname, '../../uploads');
  const relativePath = path.relative(uploadDir, filePath);
  const parts = relativePath.split(path.sep);
  
  if (parts.length < 2) return null;
  
  const fileType = parts[0]; // pdf or video
  const fileName = parts[1]; // filename
  
  // Construct the URL
  return `${baseUrl}/files/${fileType}/${fileName}`;
};

/**
 * Delete a file if it exists
 * @param {string} filePath - The path to the file
 * @returns {boolean} True if the file was deleted, false otherwise
 */
const deleteFile = (filePath) => {
  if (!filePath) return false;
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file information (size, type, etc.)
 * @param {string} filePath - The path to the file
 * @returns {Object|null} File information or null if the file doesn't exist
 */
const getFileInfo = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) return null;
  
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: ext,
      type: ext === '.pdf' ? 'pdf' : 'video'
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

module.exports = {
  getFileUrl,
  deleteFile,
  getFileInfo
};
