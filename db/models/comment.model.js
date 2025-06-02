const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
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
  likeCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
commentSchema.index({ post: 1, createdAt: -1 }); // For post comments
commentSchema.index({ user: 1, createdAt: -1 }); // For user's comments

// Middleware to update timestamps
commentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createdAt = this.updatedAt = Date.now();
  } else {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
