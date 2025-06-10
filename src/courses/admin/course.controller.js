const Course = require("../../../db/models/course.model");
const CourseService = require("../services/course.service");

// Get all courses with optional filtering
const getCourses = async (req, res) => {
  try {
    const { type, subtype, ageGroup, level, position, dataType } = req.query;
    
    // Build filter object based on provided query parameters
    const filter = {};
    if (type) filter.type = type;
    if (subtype) filter.subtype = subtype;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (level) filter.level = level;
    if (position) filter.position = position;
    if (dataType) filter.dataType = dataType;
    
    const courses = await CourseService.getCourses(filter);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseService.getCourseById(id);
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    if (error.message === "Course not found") {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      subtype, 
      ageGroup, 
      level, 
      position, 
      thumbnail,
      chapters
    } = req.body;

    console.log("Creating course with data:", req.body);  
    // Validate required fields
    if (!title || !description || !type || !ageGroup || !level || !position) {
      return res.status(400).json({ message: "All required course fields must be provided" });
    }

    // Validate chapters if provided
    if (chapters && chapters.length > 0) {
      // Validate each chapter has required fields
      for (const chapter of chapters) {
        if (!chapter.title || !chapter.description || !chapter.dataType || chapter.order === undefined) {
          return res.status(400).json({ 
            message: "All chapter fields must be provided", 
            requiredFields: ["title", "description", "dataType", "order"]
          });
        }
      }
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      type,
      subtype,
      ageGroup,
      level,
      position,
      thumbnail: thumbnail || "",
      chapters: chapters || [],
      createdBy: req.user ? req.user._id : null
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course", error: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      type, 
      subtype, 
      ageGroup, 
      level, 
      position, 
      thumbnail,
      chapters,
      isActive
    } = req.body;

    // Build update object
    const updateData = {};
    
    // Add fields that are provided
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (subtype !== undefined) updateData.subtype = subtype;
    if (ageGroup !== undefined) updateData.ageGroup = ageGroup;
    if (level !== undefined) updateData.level = level;
    if (position !== undefined) updateData.position = position;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Handle chapters update if provided
    if (chapters !== undefined) {
      // Validate each chapter has required fields
      if (chapters.length > 0) {
        for (const chapter of chapters) {
          if (!chapter.title || !chapter.description || !chapter.dataType || chapter.order === undefined) {
            return res.status(400).json({ 
              message: "All chapter fields must be provided", 
              requiredFields: ["title", "description", "dataType", "order"]
            });
          }
        }
      }
      updateData.chapters = chapters;
    }

    // Find and update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course", error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the course first to get file paths
    const course = await CourseService.getCourseById(id);
    
    // Delete thumbnail if it exists
    if (course.thumbnail) {
      await CourseService.deleteFile(course.thumbnail);
    }
    
    // Delete all chapter files if they exist
    if (course.chapters && course.chapters.length > 0) {
      for (const chapter of course.chapters) {
        if (chapter.filePath) {
          await CourseService.deleteFile(chapter.filePath);
        }
      }
    }
    
    // Delete the course from database
    await Course.findByIdAndDelete(id);
    
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    if (error.message === "Course not found") {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
};

// Get course statistics
const getCourseStats = async (req, res) => {
  try {
    const stats = await CourseService.getStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    res.status(500).json({ message: "Failed to fetch course statistics", error: error.message });
  }
};

// Get course subtypes by type
const getCourseSubtypes = async (req, res) => {
  try {
    const { type } = req.params;
    const subtypes = await CourseService.getSubtypesByType(type);
    res.json(subtypes);
  } catch (error) {
    console.error("Error fetching course subtypes:", error);
    res.status(500).json({ message: "Failed to fetch course subtypes", error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCourseSubtypes
};
