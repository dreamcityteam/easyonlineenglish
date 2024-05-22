import { State } from './type';

const initialState: State = {
  user: null,
  loading: { canShow: false, text: '' },
  currentPathCourse: null,
  courseCache: {},
  coursesCache: {},
  libraryCache: []
}

export default initialState;
