import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { authApi } from '../services/authService';
import { commonApi } from '../services/commonService';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { adminApi } from '../services/adminServices';
import { organizationApi } from '../services/organizationService';
import { rtkQueryErrorLogger } from '../services/common/middleware';
import { notaryApi } from '../services/notaryService';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(rtkQueryErrorLogger)
      .concat(
        authApi.middleware,
        commonApi.middleware,
        adminApi.middleware,
        organizationApi.middleware,
        notaryApi.middleware
        // rtkQueryErrorLogger
      );
  },
});

setupListeners(store.dispatch);
export default store;
