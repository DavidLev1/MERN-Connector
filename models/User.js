const mongoose = require('mongoose');
const getFormattedDate = require('../utils/date-format.js');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // To disable 2 or more same emails
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    // type: Date,
    // default: Date.now, // To get current date and time
    type: String,
    default: getFormattedDate(new Date()),
  },
});

// 'user' is a model name
// so, collection name in MongoDB will be 'users' (pluralizes 'user')
module.exports = User = mongoose.model('user', UserSchema);
