import layout from './layout';
import todo from '../pages/app/todo/store';
import email from '../pages/app/email/store';
import chat from '../pages/app/chat/store';
import project from '../pages/app/projects/store';
import kanban from '../pages/app/kanban/store';
import calendar from '../pages/app/calender/store';
import auth, { detailsReducer } from '../pages/auth/common/store';
import { notaryApi } from '../services/notaryService';
import { authApi } from '../services/authService';
import { commonApi } from '../services/commonService';
import { adminApi } from '../services/adminServices';
import { organizationApi } from '../services/organizationService';

const rootReducer = {
  layout,
  todo,
  email,
  chat,
  project,
  kanban,
  calendar,
  auth,
  detailsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [commonApi.reducerPath]: commonApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [notaryApi.reducerPath]: notaryApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
};

export default rootReducer;
