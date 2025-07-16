import { Router } from './type';
import { ENDPOINT } from '../tools/consts';

const config: Router[] = [
  {
    path: ENDPOINT.LOGIN,
    method: 'post',
    func: require('../api/login').default,
  },
  {
    path: ENDPOINT.AUTH,
    method: 'post',
    func: require('../api/auth').default,
  },
  {
    path: ENDPOINT.SING_UP,
    method: 'post',
    func: require('../api/signUp').default,
  },
  {
    path: ENDPOINT.SING_OUT,
    method: 'post',
    func: require('../api/signOut').default,
  },
  {
    path: ENDPOINT.SING_UP_GOOGLE,
    method: 'post',
    func: require('../api/signUpGoogle').default,
  },
  {
    path: ENDPOINT.SING_IN_GOOGLE,
    method: 'post',
    func: require('../api/loginGoogle').default,
  },
  {
    path: ENDPOINT.CONTANCT,
    method: 'post',
    func: require('../api/contanct').default,
  },
  {
    path: ENDPOINT.LIBRARY,
    method: 'get',
    func: require('../api/library').default,
  },
  {
    path: ENDPOINT.RESET_PASSWORD,
    method: 'post',
    func: require('../api/resetPassword').default,
  },
  {
    path: ENDPOINT.SEND_EMAIL_RESET_PASSWORD,
    method: 'post',
    func: require('../api/resetPassword/email').default,
  },
  {
    path: ENDPOINT.RESET_PASSWORD_AUTH,
    method: 'get',
    func: require('../api/resetPassword/auth').default,
  },
  {
    path: ENDPOINT.STUDENT_COURSE,
    method: 'get',
    func: require('../api/student/course').default,
  },
  {
    path: ENDPOINT.SUSCRIBETE,
    method: 'post',
    func: require('../api/suscribete').default,
  },
  {
    path: ENDPOINT.STUDENT_COURSE_PROGRESS,
    method: 'post',
    func: require('../api/student/course/progress').default,
  },
  {
    path: ENDPOINT.STUDENT_COURSE_DEMO,
    method: 'get',
    func: require('../api/student/course/demo').default,
  },
  {
    path: ENDPOINT.STUDENT_COURSES,
    method: 'get',
    func: require('../api/student/courses').default,
  },
  {
    path: ENDPOINT.STUDENT_COURSES_DEMO,
    method: 'get',
    func: require('../api/student/courses/demo').default,
  },
  {
    path: ENDPOINT.STUDENT_SENTENCE,
    method: 'post',
    func: require('../api/student/course/sentence').default,
  },
  {
    path: ENDPOINT.STUDENT_PHOTO,
    method: 'post',
    func: require('../api/student/photo').default,
  },
  {
    path: ENDPOINT.STUDENT_UPDATE,
    method: 'post',
    func: require('../api/student/update').default,
  },
  {
    path: ENDPOINT.STUDENT_INVOICE,
    method: 'get',
    func: require('../api/student/invoice').default,
  },
  {
    path: ENDPOINT.STUDENT_TERMS,
    method: 'patch',
    func: require('../api/student/terms').default,
  },
  {
    path: ENDPOINT.STUDENT_TUTORIAL,
    method: 'patch',
    func: require('../api/student/tutorial').default,
  },
  {
    path: ENDPOINT.STUDENT_RATING,
    method: 'post',
    func: require('../api/student/rating').default,
  },
  {
    path: ENDPOINT.STUDENT_ACTIVE_ACCOUNT,
    method: 'post',
    func: require('../api/student/activeAccount').default,
  },
  {
    path: ENDPOINT.PAYPAL_CREATE_ORDER,
    method: 'post',
    func: require('../api/student/payment/paypal/createOrder').default,
  },
  {
    path: ENDPOINT.PAYPAL_COMPLETED_ORDER,
    method: 'post',
    func: require('../api/student/payment/paypal/completedOrder').default,
  },
  {
    path: ENDPOINT.SEARCH_WORD,
    method: 'post',
    func: require('../api/admin/searchWord').default,
  },
  {
    path: ENDPOINT.UPDATE_WORD,
    method: 'put',
    func: require('../api/admin/saveWord').default,
  },
  {
    path: ENDPOINT.CREATE_WORD,
    method: 'post',
    func: require('../api/admin/createWord').default,
  },
  {
    path: ENDPOINT.ADMIN_UPDATE_LESSON_ORDER,
    method: 'put',
    func: require('../api/admin/updateLessonOrder').default,
  },
  {
    path: ENDPOINT.PAYPAL_CREATE_SUBCRIPTION,
    method: 'post',
    func: require('../api/student/payment/paypal/createSubscription').default,
  },
  {
    path: ENDPOINT.PAYPAL_CAPTURE_SUBCRIPTION,
    method: 'post',
    func: require('../api/student/payment/paypal/captureSubscription').default,
  },
  {
    path: ENDPOINT.PAYPAL_CANCEL_SUBCRIPTION,
    method: 'post',
    func: require('../api/student/payment/paypal/cancelSubscription').default,
  }
];

export default config;
