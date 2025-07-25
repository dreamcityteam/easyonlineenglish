import {
  CLEAN_CACHE,
  CLEAR_LOAD,
  SET_COURSES_CACHE,
  SET_COURSE_CACHE,
  SET_GOOGLE_ANALITICS,
  SET_LOAD,
  SET_USER,
} from './actionTypes';

type User = {
  _id: string;
  username: string;
  email: string;
  lastname: string;
  name: string;
  phone: string;
  photo: string;
  role: string;
  payment: {
    isPayment: boolean;
    plan: string | null;
    dateEnd: string | null;
    dateStart: string | null;
    orderId?: string | null;
    status?: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | null;
  };
  isTutorial: boolean;
  isTerms: boolean;
  isActive: boolean;
}

type Course = {
  idStudentCourse: string;
  picture: string;
  title: string;
  description: string;
  isCompleted: boolean;
  index: { lesson: number; word: number; sentence: number };
  unlockedWords: { [key: string]: boolean };
  completedWords: { [key: string]: boolean };
  lessons: Lesson[];
  progress: number;
}

type Courses = {
  _id: string;
  color: string;
  description: string;
  isAvaliable: Boolean,
  picture: string;
  progress?: number;
  title: string;
}

type LibraryContent = {
  _id: string;
  englishWord: string;
  spanishTranslation: string;
  imageUrl: string;
  audioUrl: string;
}

type LibraryCache = {
  _id: string;
  name: string;
  content: LibraryContent[];
}[]

type CoursesCache = {
  [key: string]: Courses[];
}

type CourseCache = {
  [key: string]: Course;
}

type Lesson = {
  title: string;
  words: Word[];
}

type Word = {
  _id: number;
  englishWord: string;
  spanishTranslation: string;
  audioUrl: string;
  sentences: Sentence[];
  type: 'exercise' | 'word';
  musicUrl: string;
  expandedExplanation?: {
    description: string;
    usageNotes: string[];
    additionalExamples: {
      english: string;
      spanish: string;
      context: string;
    }[];
    isActive: boolean;
  };
}

type Sentence = {
  spanishTranslation: string;
  englishWord: string;
  imageUrl: string;
  audioUrl: string;
  isCompleted?: boolean;
  audioSlowUrl: string;
  audioSplitUrls: string[]; 
}

type Loading = {
  canShow: boolean;
  text: string;
}

type State = {
  user: User | null;
  loading: Loading;
  courseCache: CourseCache;
  coursesCache: CoursesCache;
  libraryCache: any;
}

type Action =
  | typeof SET_USER
  | typeof CLEAR_LOAD
  | typeof SET_LOAD
  | typeof CLEAN_CACHE
  | typeof SET_COURSES_CACHE
  | typeof SET_COURSE_CACHE;

type Option = {
  payload?: any;
  type: Action;
}

export type {
  State,
  Sentence,
  Word,
  Lesson,
  Course,
  User,
  Action,
  Option,
  CourseCache,
  Courses,
  LibraryCache,
  LibraryContent,
};
