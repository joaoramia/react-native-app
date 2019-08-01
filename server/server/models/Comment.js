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
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
