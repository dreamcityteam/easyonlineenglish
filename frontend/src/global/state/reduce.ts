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
} from './actionTypes';
import { Option, State } from './type';

const reducer = (state: State, { payload, type }: Option): State => ({
  [SET_USER]: ({
    _id = '', username = '', email = '', lastname = '',
    name = '', phone = null, photo = '', role,
    payment = { isPayment: false, plan: '' }, isTutorial = true
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
      payment,
      isTutorial
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

  [SET_COURSE_CACHE]: ({
    idCourse = '',
    idStudentCourse = '',
    picture = '',
    title = '',
    description = '',
    isCompleted = false,
    index = { lesson: 0, word: 0 },
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
