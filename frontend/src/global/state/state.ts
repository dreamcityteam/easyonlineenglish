import { State } from './type';

const initialState: State = {
  user: null,
  loading: { canShow: false, text: '' },
  currentPathCourse: null,
  courseCache: {},
  coursesCache: {},
  libraryCache: [],
  googleAnalytics: () => {},
}

export default initialState;
