const express = require('express');
const { 
  upload, 
  thumbnailUpload, 
  uploadCourseContent, 
  uploadCourseThumbnail 
} = require('./upload.controller');
const { authMiddleware } = require('../../middleware/authorization.middleware');

const router = express.Router();

// Protected routes for file uploads - only accessible to authenticated users (typically admins)
router.post('/admin/courses/upload-content', authMiddleware, upload.single('content'), uploadCourseContent);
router.post('/admin/courses/upload-thumbnail', authMiddleware, thumbnailUpload.single('thumbnail'), uploadCourseThumbnail);

module.exports = router;
