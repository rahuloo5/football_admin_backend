const Course = require("../../../db/models/course.model");
const CourseService = require("../services/course.service");

// Get all active courses with filtering options for users, organized by type and subtype
const getUserCourses = async (req, res) => {
  try {
    const { ageGroup, level, position } = req.query;
    
    // Build filter object based on provided query parameters
    const filter = {};
    // if (ageGroup) filter.ageGroup = ageGroup;
    // if (level) filter.level = level;
    // if (position) filter.position = position;
    
    // Get only active courses with the service
    const courses = await CourseService.getCourses(filter, true);
    
    // Organize courses by type and subtype
    const organizedCourses = {};
    
    // First, group by type
    courses.forEach(course => {
      if (!organizedCourses[course.type]) {
        organizedCourses[course.type] = {};
      }
      
      // Then group by subtype within each type
      if (!organizedCourses[course.type][course.subtype]) {
        organizedCourses[course.type][course.subtype] = [];
      }
      
      // Add course to its type and subtype group with all necessary fields including chapters
      organizedCourses[course.type][course.subtype].push({
        _id: course._id,
        title: course.title,
        description: course.description,
        ageGroup: course.ageGroup,
        level: course.level,
        position: course.position,
        dataType: course.dataType,
        thumbnail: course.thumbnail,
        chapters: course.chapters,
        createdAt: course.createdAt
      });
    });
    
    // Transform into a more structured response format
    const response = Object.keys(organizedCourses).map(type => {
      const subtypes = Object.keys(organizedCourses[type]).map(subtype => {
        // Since a subtype will never have multiple courses, take the first (and only) course
        const course = organizedCourses[type][subtype][0] || {};
        
        return {
          name: subtype,
          subtitle: `${subtype} ${type} courses`,
          _id: course._id,
          title: course.title,
          description: course.description,
          ageGroup: course.ageGroup,
          level: course.level,
          position: course.position,
          dataType: course.dataType,
          thumbnail: course.thumbnail,
          chapters: course.chapters,
          createdAt: course.createdAt
        };
      });
      
      return {
        type,
        subtypes
      };
    });
      
    res.json(response);
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};

// Get a single course by ID for users
const getUserCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseService.getCourseById(id, true); // true for activeOnly
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    if (error.message === "Course not found") {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
};

// Get course subtypes based on type
const getCourseSubtypes = async (req, res) => {
  try {
    const { type } = req.params;
    const subtypes = await CourseService.getSubtypesByType(type);
    res.json(subtypes);
  } catch (error) {
    console.error("Error fetching course subtypes:", error);
    if (error.message === "Invalid course type") {
      return res.status(400).json({ message: "Invalid course type" });
    }
    res.status(500).json({ message: "Failed to fetch course subtypes", error: error.message });
  }
};

// Search courses based on query
const searchCourses = async (req, res) => {
  try {
    const { query, type, dataType } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    // Build the search filter
    const filter = {
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { subtype: { $regex: query, $options: 'i' } }
      ]
    };
    
    // Add optional filters if provided
    if (type) {
      filter.type = type;
    }
    
    if (dataType) {
      filter.dataType = dataType;
    }
    
    // Execute search
    const courses = await Course.find(filter)
      .select('title description type subtype ageGroup level position dataType thumbnail createdAt')
      .sort({ createdAt: -1 })
      .limit(20); // Limit results to prevent performance issues
    
    res.json(courses);
  } catch (error) {
    console.error("Error searching courses:", error);
    res.status(500).json({ message: "Failed to search courses", error: error.message });
  }
};

// Get recommended courses based on user preferences or popular courses
const getRecommendedCourses = async (req, res) => {
  try {
    const { type, ageGroup, level, position } = req.query;
    
    // Build filter based on user preferences if available
    const filter = { isActive: true };
    
    if (type) filter.type = type;
    if (ageGroup) filter.ageGroup = ageGroup;
    if (level) filter.level = level;
    if (position) filter.position = position;
    
    // Get recommended courses based on filter
    const courses = await Course.find(filter)
      .select('title description type subtype ageGroup level position dataType thumbnail createdAt')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(courses);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    res.status(500).json({ message: "Failed to fetch recommended courses", error: error.message });
  }
};

module.exports = {
  getUserCourses,
  getUserCourseById,
  getCourseSubtypes,
  searchCourses,
  getRecommendedCourses
};
