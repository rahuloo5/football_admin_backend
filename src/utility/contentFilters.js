/**
 * Helper functions for content filtering
 */

/**
 * Build a MongoDB filter object based on query parameters
 * @param {Object} queryParams - The query parameters from the request
 * @returns {Object} MongoDB filter object
 */
const buildContentFilter = (queryParams) => {
  const filter = {};
  
  // Add filters for each parameter if provided
  if (queryParams.ageGroup) filter.ageGroup = queryParams.ageGroup;
  if (queryParams.level) filter.level = queryParams.level;
  if (queryParams.position) filter.position = queryParams.position;
  if (queryParams.category) filter.category = queryParams.category;
  if (queryParams.subcategory) filter.subcategory = queryParams.subcategory;
  if (queryParams.dataType) filter.dataType = queryParams.dataType;
  
  return filter;
};

/**
 * Get related content based on a specific content item
 * @param {Object} content - The content item to find related content for
 * @param {Number} limit - Maximum number of related items to return
 * @returns {Object} MongoDB query object
 */
const getRelatedContentQuery = (content, limit = 5) => {
  return {
    $and: [
      { _id: { $ne: content._id } }, // Exclude the current content
      { 
        $or: [
          { ageGroup: content.ageGroup },
          { level: content.level },
          { position: content.position },
          { category: content.category }
        ] 
      }
    ],
    limit
  };
};

module.exports = {
  buildContentFilter,
  getRelatedContentQuery
};
