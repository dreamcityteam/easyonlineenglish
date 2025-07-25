import { DEFAULT_PHOTO } from '../../tools/constant';
import {
  SET_USER,
  CLEAR_LOAD,
  SET_LOAD,
  SIGN_OUT,
  SET_COURSE_CACHE,
  SET_COURSES_CACHE,
  CLEAN_CACHE,
  SET_LIBRARY,
  SET_TUTORIAL,
  DELETE_ACCOUNT,
  UPDATE_STUDENT_PHOTO,
  UPDATE_STUDENT_TERMS
} from './actionTypes';
import { Option, State } from './type';

const reducer = (state: State, { payload, type }: Option): State => ({
  [SET_USER]: ({
    _id = '', username = '', email = '', lastname = '',
    name = '', phone = '', photo = '', role, isTerms = false,
    payment = { isPayment: false, plan: '', orderId: null, status: null }, isTutorial = true,
    isActive = false
  }: any): State => ({
    ...state,
    user: {
      _id,
      username,
      email,
      lastname,
      name,
      phone,
      photo: photo || DEFAULT_PHOTO,
      role,
      payment: {
        isPayment: payment.isPayment || false,
        plan: payment.plan || null,
        dateEnd: payment.dateEnd || null,
        dateStart: payment.dateStart || null,
        orderId: payment.orderId || null,
        status: payment.status || null
      },
      isTutorial,
      isTerms,
      isActive
    }
  }),

  [SET_TUTORIAL]: ({ isTutorial = true }: any): State => ({
    ...state,
    user: state.user ? {
      ...state.user,
      isTutorial
    } : state.user,
  }),

  [SIGN_OUT]: (): State => ({
    ...state,
    user: null
  }),

  [UPDATE_STUDENT_PHOTO]: ({ photo }: { photo: string; }): State => ({
    ...state,
    user: state.user ? { ...state.user, photo } : null
  }),

  [UPDATE_STUDENT_TERMS]: ({ isTerms }: { isTerms: boolean; }): State => ({
    ...state,
    user: state.user ? { ...state.user, isTerms } : null
  }),

  [CLEAR_LOAD]: (): State => ({
    ...state,
    loading: {
      canShow: false,
      text: ''
    }
  }),

  [SET_LOAD]: (payload: any): State => ({
    ...state,
    loading: {
      canShow: payload.canShow || false,
      text: payload.text || ''
    }
  }),

  [SET_COURSES_CACHE]: ({ value = [], key = 'demo' }: any): State => ({
    ...state,
    coursesCache: {
      ...state.coursesCache,
      [key]: value
    }
  }),

  [CLEAN_CACHE]: (): State => ({
    ...state,
    coursesCache: {},
    courseCache: {},
    libraryCache: []
  }),

  [SET_LIBRARY]: ({ library = [] }: any): State => ({
    ...state,
    libraryCache: library,
  }),

  [DELETE_ACCOUNT]: (): State => ({
    ...state,
    user: null,
  }),

  [SET_COURSE_CACHE]: ({
    idCourse = '',
    idStudentCourse = '',
    picture = '',
    title = '',
    description = '',
    isCompleted = false,
    index = { lesson: 0, word: 0, sentence: 0 },
    unlockedWords = {},
    completedWords = {},
    lessons = [],
    progress = 0
  }): State => ({
    ...state,
    courseCache: {
      ...state.courseCache,
      [idCourse]: {
        idStudentCourse,
        picture,
        title,
        description,
        isCompleted,
        index,
        unlockedWords,
        completedWords,
        lessons,
        progress
      }
    }
  }),
}[type](payload));

export default reducer;
