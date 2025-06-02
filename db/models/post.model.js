const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Post content
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2200
  },
  
  // Single image (stored as Base64)
  image: {
    data: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.length < 3000000, // ~3MB limit for Base64
        message: 'Image is too large (max ~3MB)'
      }
    },
    mimeType: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'image/webp'],
      default: 'image/jpeg'
    },
    width: Number,
    height: Number,
    aspectRatio: Number,
    size: Number  // Size in bytes
  },
  
  // Reference to the user who created the post
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Comments (stored as references)
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  
  // Comments count (denormalized for performance)
  commentsCount: {
    type: Number,
    default: 0
  },
  
  // Likes (embedded for quick access)
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Like count (denormalized for performance)
  likeCount: {
    type: Number,
    default: 0
  },
  
  // Post metadata
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 }); // For user's posts feed
postSchema.index({ createdAt: -1 }); // For global feed
postSchema.index({ likeCount: -1 }); // For popular posts

// Middleware to update timestamps
postSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = this.updatedAt = Date.now();
  } else {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
