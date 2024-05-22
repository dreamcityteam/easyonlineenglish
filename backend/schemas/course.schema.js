const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  picture: String,
  title: String,
  description: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
