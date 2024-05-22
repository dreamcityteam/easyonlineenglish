const Course = require('../schemas/course.schema');
const User = require('../schemas/user.schema');
const CourseWord = require('../schemas/courseWord.schema');
const Library = require('../schemas/library.schema');
const { ROLE, INITIAL_COURSE } = require('../tools/constant');
const { hash } = require('../tools/functions');
const courseWords = require('./courseWord.json');
const libraries = require('./libraries.json');

const initialDatabase = async () => {
  try {
    const {
      ADMIN_USERNAME,
      ADMIN_NAME,
      ADMIN_LASTNAME,
      ADMIN_EMAIL,
      ADMIN_PHONE,
      ADMIN_PASSWORD,
    } = process.env;

    let admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      admin = await User.create({
        username: ADMIN_USERNAME,
        name: ADMIN_NAME,
        lastname: ADMIN_LASTNAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: await hash.create(ADMIN_PASSWORD),
        role: ROLE.ADMIN,
      });
      console.log('Admin inserted successfully');
    } else {
      console.log('Admin already exists.');
    }

    let course = await Course.findOne({ title: 'Inglés Conversacional' });
    if (!course) {
      course = await Course.create({
        picture: INITIAL_COURSE.PICTURE,
        title: INITIAL_COURSE.TITLE,
        description: INITIAL_COURSE.DESCRIPTION,
      });
      console.log('Course inserted successfully');
      const words = courseWords.map((courseWord) => ({
        idCourse: course._id,
        ...courseWord,
      }));

      await CourseWord.insertMany(words);
      console.log('Words inserted successfully');
    } else {
      console.log('Course already exists.');
    }

    const existingLibrary = await Library.findOne();

    if (!existingLibrary) {
      await Library.insertMany(libraries);
      console.log('Libraries inserted successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = initialDatabase;
