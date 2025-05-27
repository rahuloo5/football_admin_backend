const express = require("express");
const {
  serveCourseContent,
  serveCourseThumbnail
} = require("./fileServe.controller");

const router = express.Router();

// Public routes for serving course files
router.get("/courses/content/:filepath(*)", serveCourseContent);
router.get("/courses/thumbnail/:filename", serveCourseThumbnail);

module.exports = router;
