const mongoose = require('mongoose');

// Define the schema directly in the migration script
const sentenceSchema = new mongoose.Schema({
  englishWord: { type: String, required: true },
  spanishTranslation: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  audioUrl: { type: String, required: true },
  audioSlowUrl: { type: String, default: '' },
  audioSplitUrls: [String],
});

const courseWordSchema = new mongoose.Schema({
  type: { type: String, enum: ['word', 'exercise'], default: 'word' },
  musicUrl: { type: String, default: '' },
  englishWord: { type: String, required: true },
  spanishTranslation: { type: String, required: true },
  audioUrl: { type: String },
  sentences: [sentenceSchema],
  idCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonNumber: { type: Number, default: 1 },
  orderInLesson: { type: Number, default: 0 },
  globalOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CourseWord = mongoose.model('CourseWord', courseWordSchema);

// MongoDB connection URI for development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyonlineenglish-dev';

async function migrateLessonOrder() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Get all courses
    const courses = await CourseWord.distinct('idCourse');
    console.log(`Found ${courses.length} courses to migrate`);

    for (const courseId of courses) {
      console.log(`\nMigrating course: ${courseId}`);
      
      // Get all words for this course, sorted by _id (creation order)
      const words = await CourseWord.find({ idCourse: courseId, type: 'word' })
        .sort({ _id: 1 })
        .select({ _id: 1, englishWord: 1, lessonNumber: 1, orderInLesson: 1, globalOrder: 1 });

      console.log(`Found ${words.length} words in course ${courseId}`);

      // Update each word with lesson and order information
      const wordsPerLesson = 25;
      const updatePromises = words.map(async (word, index) => {
        const lessonNumber = Math.floor(index / wordsPerLesson) + 1;
        const orderInLesson = index % wordsPerLesson;
        const globalOrder = index;

        // Only update if the fields are not already set correctly
        if (word.lessonNumber !== lessonNumber || 
            word.orderInLesson !== orderInLesson || 
            word.globalOrder !== globalOrder) {
          
          await CourseWord.findByIdAndUpdate(word._id, {
            $set: {
              lessonNumber: lessonNumber,
              orderInLesson: orderInLesson,
              globalOrder: globalOrder,
              updatedAt: new Date()
            }
          });

          return {
            _id: word._id,
            englishWord: word.englishWord,
            lessonNumber: lessonNumber,
            orderInLesson: orderInLesson,
            globalOrder: globalOrder
          };
        }
        
        return null;
      });

      const updatedWords = (await Promise.all(updatePromises)).filter(Boolean);
      console.log(`Updated ${updatedWords.length} words in course ${courseId}`);
      
      if (updatedWords.length > 0) {
        console.log('Sample updates:');
        updatedWords.slice(0, 5).forEach(word => {
          console.log(`  - ${word.englishWord}: Lesson ${word.lessonNumber}, Order ${word.orderInLesson}`);
        });
      }
    }

    console.log('\n✅ Migration completed successfully!');
    
    // Verify migration
    const totalWords = await CourseWord.countDocuments({ type: 'word' });
    const wordsWithOrder = await CourseWord.countDocuments({ 
      type: 'word',
      lessonNumber: { $exists: true, $gte: 1 },
      orderInLesson: { $exists: true, $gte: 0 },
      globalOrder: { $exists: true, $gte: 0 }
    });

    console.log(`\n📊 Migration Summary:`);
    console.log(`Total words: ${totalWords}`);
    console.log(`Words with order data: ${wordsWithOrder}`);
    console.log(`Migration success rate: ${((wordsWithOrder / totalWords) * 100).toFixed(2)}%`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  console.log('🚀 Starting lesson order migration...');
  migrateLessonOrder();
}

module.exports = migrateLessonOrder;
