const mongoose = require('mongoose');

// Define the schema directly
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://info:MP4nqS0T345DYxgK@cluster0.ppemsor.mongodb.net/easyonlineenglish_dev?retryWrites=true&w=majority&appName=Cluster0';

async function checkPapotePosition() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Find Papote
    const papote = await CourseWord.findOne({ 
      englishWord: 'Papote',
      type: 'word'
    }).select({
      englishWord: 1,
      spanishTranslation: 1,
      lessonNumber: 1,
      orderInLesson: 1,
      globalOrder: 1,
      updatedAt: 1
    });

    if (papote) {
      console.log('\n📍 Estado actual de "Papote":');
      console.log(`- Palabra: ${papote.englishWord}`);
      console.log(`- Traducción: ${papote.spanishTranslation}`);
      console.log(`- Lección: ${papote.lessonNumber}`);
      console.log(`- Orden en lección: ${papote.orderInLesson}`);
      console.log(`- Orden global: ${papote.globalOrder}`);
      console.log(`- Última actualización: ${papote.updatedAt}`);
    } else {
      console.log('❌ No se encontró la palabra "Papote"');
    }

    // Find words around Papote's position
    console.log('\n📋 Palabras en Lección 1 (primeras 10):');
    const lesson1Words = await CourseWord.find({ 
      lessonNumber: 1,
      type: 'word'
    })
    .sort({ orderInLesson: 1 })
    .limit(10)
    .select({
      englishWord: 1,
      orderInLesson: 1,
      globalOrder: 1
    });

    lesson1Words.forEach((word, index) => {
      console.log(`${index + 1}. ${word.englishWord} (orden: ${word.orderInLesson}, global: ${word.globalOrder})`);
    });

    console.log('\n📋 Palabras en Lección 2 (primeras 10):');
    const lesson2Words = await CourseWord.find({ 
      lessonNumber: 2,
      type: 'word'
    })
    .sort({ orderInLesson: 1 })
    .limit(10)
    .select({
      englishWord: 1,
      orderInLesson: 1,
      globalOrder: 1
    });

    lesson2Words.forEach((word, index) => {
      console.log(`${index + 1}. ${word.englishWord} (orden: ${word.orderInLesson}, global: ${word.globalOrder})`);
    });

    // Check for exercises that might be mixed in
    console.log('\n🔍 Verificando ejercicios...');
    const exercises = await CourseWord.find({ type: 'exercise' })
      .select({
        englishWord: 1,
        type: 1,
        lessonNumber: 1,
        orderInLesson: 1,
        globalOrder: 1
      });

    console.log(`Encontrados ${exercises.length} ejercicios:`);
    exercises.forEach(exercise => {
      console.log(`- ${exercise.englishWord} (tipo: ${exercise.type}, lección: ${exercise.lessonNumber || 'sin asignar'})`);
    });

    // Check for duplicates or inconsistencies
    console.log('\n🔍 Verificando inconsistencias en palabras...');
    const allWords = await CourseWord.find({ type: 'word' })
      .sort({ globalOrder: 1 })
      .select({
        englishWord: 1,
        lessonNumber: 1,
        orderInLesson: 1,
        globalOrder: 1
      });

    const duplicateGlobalOrders = {};
    allWords.forEach(word => {
      if (duplicateGlobalOrders[word.globalOrder]) {
        console.log(`⚠️  Orden global duplicado ${word.globalOrder}: ${duplicateGlobalOrders[word.globalOrder]} y ${word.englishWord}`);
      } else {
        duplicateGlobalOrders[word.globalOrder] = word.englishWord;
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
    process.exit(0);
  }
}

// Run check
console.log('🔍 Verificando posición de Papote...');
checkPapotePosition();
