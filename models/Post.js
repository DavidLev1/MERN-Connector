const mongoose = require('mongoose');
//const getFormattedDate = require('../utils/date-format.js');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // Reference to 'user' model, cause every post should be associated with user
  user: {
    type: Schema.Types.ObjectId, // Be able to connect post to id of its user
    ref: 'user', // reference to 'users' model
  },
  text: {
    type: String,
    required: true,
  },
  // Name of the post
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      // Array of users objs, each obj has user id
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users', // To know which like came from each user
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      // Date of the comment
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // Date of the post
  date: {
    type: Date,
    default: Date.now,
    // type: String,
    // default: getFormattedDate(new Date()),
  },
});

// 'post' is a model name
// so, collection name in MongoDB will be 'posts' (pluralizes 'post')
module.exports = mongoose.model('post', PostSchema);
