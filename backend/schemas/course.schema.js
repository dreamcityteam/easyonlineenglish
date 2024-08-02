const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  picture: String,
  title: String,
  description: String,
  isAvaliable: {
    type: Boolean, 
    default: true
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
