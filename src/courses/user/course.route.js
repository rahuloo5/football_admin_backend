const express = require("express");
const {
  getUserCourses,
  getUserCourseById,
  getCourseSubtypes,
  searchCourses,
  getRecommendedCourses
} = require("./course.controller");
const { authMiddleware } = require("../../middleware/authorization.middleware");

const router = express.Router();

// Public routes for user-side access
router.get("/courses",getUserCourses);
router.get("/courses/search", authMiddleware,searchCourses);
router.get("/courses/recommended", authMiddleware,getRecommendedCourses);
router.get("/courses/:id", authMiddleware,getUserCourseById);
router.get("/course-subtypes/:type", authMiddleware,getCourseSubtypes);

module.exports = router;
