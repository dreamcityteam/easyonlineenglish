const mongoose = require('mongoose');
require('dotenv').config();

// Define Course schema directly
const courseSchema = new mongoose.Schema({
  title: String,
  createdAt: Date
});

const Course = mongoose.model('Course', courseSchema);

async function findCourseId() {
  try {
    // Connect to development database
    await mongoose.connect(process.env.MONGODB_URI_DEVELOPMENT);
    console.log('✅ Connected to development database');

    // Find all courses
    const courses = await Course.find({}).select({
      _id: 1,
      title: 1,
      createdAt: 1
    });

    console.log('\n📚 Cursos encontrados en desarrollo:');
    console.log('=====================================');
    
    if (courses.length === 0) {
      console.log('❌ No se encontraron cursos en la base de datos de desarrollo.');
      console.log('💡 Puede que necesites ejecutar el seeding inicial.');
    } else {
      courses.forEach((course, index) => {
        console.log(`${index + 1}. Título: "${course.title}"`);
        console.log(`   ID: ${course._id}`);
        console.log(`   Creado: ${course.createdAt}`);
        console.log('');
      });
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

findCourseId();
