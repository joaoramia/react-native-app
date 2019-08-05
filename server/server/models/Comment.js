const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "can't be blank"]
    },
    userId: {
      type: String,
      required: [true, "userId can't be blank"]
    },
    city: {
      type: String
    },
    coords: {
      lat: {
        type: Number
      },
      lng: {
        type: Number
      }
    },
    likes: {
      type: Number,
      default: 0
    },
    likedUsers: {
      type: [String],
      default: []
    },
    dislikedUsers: {
      type: [String],
      default: []
    },
    comments: {
      type: Array,
      default: []
    },
    reportAbuse: {
      type: Number,
      default: 0
    },
    comments: {
      type: Array
    },
    color: {
      type: Number
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
