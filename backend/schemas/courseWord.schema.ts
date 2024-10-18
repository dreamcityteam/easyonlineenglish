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
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  audioSlowUrl: {
    type: String,
    required: true
  },
  audioSplitUrls: [String],
});

const courseWordSchema = new Schema({
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
