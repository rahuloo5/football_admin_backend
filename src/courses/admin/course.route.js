const express = require("express");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCourseSubtypes
} = require("./course.controller");
const { authMiddleware } = require("../../middleware/authorization.middleware");

const router = express.Router();

// Admin routes for course management
router.get("/admin/courses", authMiddleware, getCourses);
router.get("/admin/courses/stats", authMiddleware, getCourseStats);
router.get("/admin/courses/subtypes/:type", authMiddleware, getCourseSubtypes);
router.get("/admin/courses/:id", authMiddleware, getCourseById);
router.post("/admin/courses", createCourse);
router.put("/admin/courses/:id", authMiddleware, updateCourse);
router.delete("/admin/courses/:id", authMiddleware, deleteCourse);

module.exports = router;
