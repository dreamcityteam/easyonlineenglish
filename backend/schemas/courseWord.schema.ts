import mongoose, { Schema } from 'mongoose';

const sentenceSchema = new Schema({
  englishWord: {
    type: String,
    required: true
  },
  spanishTranslation: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    required: true
  },
  audioSlowUrl: {
    type: String,
    default: ''
  },
  audioSplitUrls: [String],
});

const courseWordSchema = new Schema({
  type: {
    type: String,
    enum: ['word', 'exercise'],
    default: 'word',
  },
  musicUrl: {
    type: String,
    default: ''
  },
  englishWord: {
    type: String,
    required: true
  },
  spanishTranslation: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
  },
  sentences: [sentenceSchema],
  idCourse: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
});

const CourseWord = mongoose.model('CourseWord', courseWordSchema);

export default CourseWord;
