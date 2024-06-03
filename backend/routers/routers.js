const register = require('../api/register');
const auth = require('../api/auth');
const logout = require('../api/logout');
const contanct = require('../api/contanct');
const courses = require('../api/courses');
const studentCourse = require('../api/studentCourse');
const studentCourseProgress = require('../api/studentCourseProgress');
const studentCourseDemo = require('../api/studentCourseDemo');
const studentCoursesDemo = require('../api/studentCoursesDemo');
const library = require('../api/library');
const studentUpdate = require('../api/studentUpdate');
const sendEmailResetPassword = require('../api/sendEmailResetPassword');
const resetPasswordAuth = require('../api/resetPasswordAuth');
const resetPassword = require('../api/resetPassword');
const azulPayment = require('../api/payment');

const { ENDPOINT } = require('../tools/constant');

module.exports = [
  {
    path: ENDPOINT.REGISTER,
    method: 'post',
    func: register,
  },
  {
    path: ENDPOINT.AUTH,
    method: 'post',
    func: auth,
  },
  {
    path: ENDPOINT.LOG_OUT,
    method: 'post',
    func: logout,
  },
  {
    path: ENDPOINT.CONTANCT,
    method: 'post',
    func: contanct,
  },
  {
    path: ENDPOINT.COURSES,
    method: 'get',
    func: courses,
  },
  {
    path: ENDPOINT.COURSES_ID,
    method: 'get',
    func: studentCourse,
  },
  {
    path: ENDPOINT.STUDENT_COURSE_PROGRESS,
    method: 'post',
    func: studentCourseProgress,
  },
  {
    path: ENDPOINT.STUDENT_COURSE_DEMO,
    method: 'get',
    func: studentCourseDemo,
  },
  {
    path: ENDPOINT.STUDENT_COURSES_DEMO,
    method: 'get',
    func: studentCoursesDemo,
  },
  {
    path: ENDPOINT.LIBRARY,
    method: 'get',
    func: library,
  },
  {
    path: ENDPOINT.STUDENT_UPDATE,
    method: 'post',
    func: studentUpdate,
  },
  {
    path: ENDPOINT.SEND_EMAIL_RESET_PASSWORD,
    method: 'post',
    func: sendEmailResetPassword,
  },
  {
    path: ENDPOINT.RESET_PASSWORD_AUTH,
    method: 'get',
    func: resetPasswordAuth,
  },
  {
    path: ENDPOINT.RESET_PASSWORD,
    method: 'post',
    func: resetPassword,
  },
  {
    path: ENDPOINT.AZUL_PAYMENT,
    method: 'post',
    func: azulPayment,
  },
];
