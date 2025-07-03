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

const expandedExplanationSchema = new Schema({
  description: {
    type: String,
    default: ''
  },
  usageNotes: [{
    type: String
  }],
  additionalExamples: [{
    english: {
      type: String,
      required: true
    },
    spanish: {
      type: String,
      required: true
    },
    context: {
      type: String,
      default: ''
    }
  }],
  isActive: {
    type: Boolean,
    default: false
  }
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
  expandedExplanation: {
    type: expandedExplanationSchema,
    required: false,
    default: undefined
  },
  idCourse: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonNumber: {
    type: Number,
    default: 1
  },
  orderInLesson: {
    type: Number,
    default: 0
  },
  globalOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const CourseWord = mongoose.model('CourseWord', courseWordSchema);

export default CourseWord;
