/**
 * A file for making connection to MongoDB
 */

const mongoose = require('mongoose');
const config = require('config'); // We have installed 'config' to dependencies

// Get mongoURI from config/default.json
// 'db' is DataBase found on mongoURI
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.log(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
