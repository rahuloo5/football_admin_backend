const Course = require("../../../db/models/course.model");
const fs = require("fs");
const path = require("path");

/**
 * Service class for handling course-related operations
 */
class CourseService {
  /**
   * Get courses with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Boolean} activeOnly - Whether to return only active courses
   * @returns {Promise<Array>} - Array of courses
   */
  static async getCourses(filters = {}, activeOnly = false) {
    try {
      const queryFilters = { ...filters };
      
      // Add active filter if required
      if (activeOnly) {
        queryFilters.isActive = true;
      }
      
      return await Course.find(queryFilters).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error fetching courses: ${error.message}`);
    }
  }

  /**
   * Get course by ID
   * @param {String} id - Course ID
   * @param {Boolean} activeOnly - Whether to check for active courses only
   * @returns {Promise<Object>} - Course object
   */
  static async getCourseById(id, activeOnly = false) {
    try {
      const filter = { _id: id };
      
      if (activeOnly) {
        filter.isActive = true;
      }
      
      const course = await Course.findOne(filter);
      
      if (!course) {
        throw new Error("Course not found");
      }
      
      return course;
    } catch (error) {
      throw new Error(`Error fetching course: ${error.message}`);
    }
  }

  /**
   * Get distinct subtypes for a given course type
   * @param {String} type - Course type (training/nutrition)
   * @returns {Promise<Array>} - Array of subtypes
   */
  static async getSubtypesByType(type) {
    try {
      if (!type || !['training', 'nutrition'].includes(type)) {
        throw new Error("Invalid course type");
      }
      
      return await Course.find({ type, isActive: true }).distinct('subtype');
    } catch (error) {
      throw new Error(`Error fetching subtypes: ${error.message}`);
    }
  }

  /**
   * Get course statistics
   * @returns {Promise<Object>} - Statistics object
   */
  static async getStatistics() {
    try {
      const stats = {
        total: await Course.countDocuments(),
        active: await Course.countDocuments({ isActive: true }),
        training: await Course.countDocuments({ type: 'training' }),
        nutrition: await Course.countDocuments({ type: 'nutrition' }),
        pdf: await Course.countDocuments({ dataType: 'pdf' }),
        video: await Course.countDocuments({ dataType: 'video' })
      };
      
      return stats;
    } catch (error) {
      throw new Error(`Error fetching course statistics: ${error.message}`);
    }
  }

  /**
   * Delete course file from storage
   * @param {String} filePath - Path to the file
   * @returns {Promise<Boolean>} - Success status
   */
  static async deleteFile(filePath) {
    try {
      if (!filePath) return false;
      
      const fullPath = path.join(__dirname, "../../uploads", filePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
      return false;
    }
  }
}

module.exports = CourseService;
