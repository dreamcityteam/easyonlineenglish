const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
  color: {
    type: String, 
    default: '#06609e'
  },
  description: String,
  picture: String,
  title: String,
  isAvaliable: {
    type: Boolean, 
    default: true
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
