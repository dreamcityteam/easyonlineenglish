import { State } from './type';

const initialState: State = {
  user: null,
  loading: { canShow: false, text: '' },
  courseCache: {},
  coursesCache: {},
  libraryCache: [],
}

export default initialState;
