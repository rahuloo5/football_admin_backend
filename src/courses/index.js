// Admin routes
const adminCourseRoutes = require('./admin/course.route');
const adminUploadRoutes = require('./admin/upload.route');

// User routes
const userCourseRoutes = require('./user/course.route');

// Utility routes
const fileServeRoutes = require('./utils/fileServe.route');

// Export all course module routes
module.exports = [
  adminCourseRoutes,
  adminUploadRoutes,
  userCourseRoutes,
  fileServeRoutes
];
