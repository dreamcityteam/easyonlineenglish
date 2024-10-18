import mongoose, { Schema } from 'mongoose';

const studentCourseSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  idCourse: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  index: {
    lesson: {
      type: Number,
      default: 0
    },
    word: {
      type: Number,
      default: 0
    },
    sentence: {
      type: Number,
      default: 0
    }
  },
  unlockedWords: {
    type: Map, 
    of: Boolean,
    default: {}
  },
  completedWords: {
    type: Map,
    of: Boolean,
    default: {} 
  },
  progress: {
    type: Number,
    default: 0
  }
});

const StudentCourse = mongoose.model('StudentCourse', studentCourseSchema);

export default StudentCourse;
