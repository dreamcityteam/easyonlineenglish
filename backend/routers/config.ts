import { Router } from './type';
import { ENDPOINT } from '../tools/consts';
import register from '../api/signUp';
import signOut from '../api/signOut';
import login from '../api/login';
import auth from '../api/auth';
import signUpGoogle from '../api/signUpGoogle';
import loginGoogle from '../api/loginGoogle';
import contanct from '../api/contanct';
import courses from '../api/student/courses';
import library from '../api/library';
import resetPassword from '../api/resetPassword';
import resetPasswordAuth from '../api/resetPassword/auth';
import emailResetPassword from '../api/resetPassword/email';
import suscribete from '../api/suscribete';
import studentCourse from '../api/student/course';
import studentCourseProgress from '../api/student/course/progress';
import studentCourseDemo from '../api/student/course/demo';
import studentCoursesDemo from '../api/student/courses/demo';
import studentSentence from '../api/student/course/sentence';
import studentPhoto from '../api/student/photo';
import studentUpdate from '../api/student/update';
import studentInvoice from '../api/student/invoice';
import studentTerms from '../api/student/terms';
import studentTutorial from '../api/student/tutorial';
import studentRating from '../api/student/rating';
import studentActiveAccount from '../api/student/activeAccount';
import azul3ds from '../api/azul3ds';

const config: Router[] = [
  {
    path: ENDPOINT.LOGIN,
    method: 'post',
    func: login,
  },
  {
    path: ENDPOINT.AUTH,
    method: 'post',
    func: auth,
  },
  {
    path: ENDPOINT.SING_UP,
    method: 'post',
    func: register,
  },
  {
    path: ENDPOINT.SING_OUT,
    method: 'post',
    func: signOut,
  },
  {
    path: ENDPOINT.SING_UP_GOOGLE,
    method: 'post',
    func: signUpGoogle,
  },
  {
    path: ENDPOINT.LOGIN_GOOGLE,
    method: 'post',
    func: loginGoogle,
  },
  {
    path: ENDPOINT.CONTANCT,
    method: 'post',
    func: contanct,
  },
  {
    path: ENDPOINT.LIBRARY,
    method: 'get',
    func: library,
  },
  {
    path: ENDPOINT.RESET_PASSWORD,
    method: 'post',
    func: resetPassword,
  },
  {
    path: ENDPOINT.SEND_EMAIL_RESET_PASSWORD,
    method: 'post',
    func: emailResetPassword,
  },
  {
    path: ENDPOINT.RESET_PASSWORD_AUTH,
    method: 'get',
    func: resetPasswordAuth,
  },
  {
    path: ENDPOINT.STUDENT_COURSE,
    method: 'get',
    func: studentCourse,
  },
  {
    path: ENDPOINT.SUSCRIBETE,
    method: 'post',
    func: suscribete,
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
    path: ENDPOINT.STUDENT_COURSES,
    method: 'get',
    func: courses,
  },
  {
    path: ENDPOINT.STUDENT_COURSES_DEMO,
    method: 'get',
    func: studentCoursesDemo,
  },
  {
    path: ENDPOINT.STUDENT_SENTENCE,
    method: 'post',
    func: studentSentence
  },
  {
    path: ENDPOINT.STUDENT_PHOTO,
    method: 'post',
    func: studentPhoto,
  },
  {
    path: ENDPOINT.STUDENT_UPDATE,
    method: 'post',
    func: studentUpdate,
  },
  {
    path: ENDPOINT.STUDENT_INVOICE,
    method: 'get',
    func: studentInvoice,
  },
  {
    path: ENDPOINT.STUDENT_TERMS,
    method: 'patch',
    func: studentTerms,
  },
  {
    path: ENDPOINT.STUDENT_TUTORIAL,
    method: 'patch',
    func: studentTutorial,
  },
  {
    path: ENDPOINT.STUDENT_RATING,
    method: 'post',
    func: studentRating
  },
  {
    path: ENDPOINT.STUDENT_ACTIVE_ACCOUNT,
    method: 'post',
    func: studentActiveAccount
  },
  {
    path: ENDPOINT.AZUL_PAYMENT_3DS,
    method: 'post',
    func: azul3ds
  }
  // {
  //   path: ENDPOINT.AZUL_PAYMENT,
  //   method: 'post',
  //   func: azulPayment,
  // },
  // {
  //   path: ENDPOINT.PAYPAL,
  //   method: 'post',
  //   func: paypal,
  // },
  // {
  //   path: ENDPOINT.STUDENT_DELETE_ACCOUNT,
  //   method: 'patch',
  //   func: studentDeleteAccount,
  // },
  // {
  //   path: ENDPOINT.UPLOAD_FILE,
  //   method: 'post',
  //   func: uploadFile
  // },
];

export default config;
