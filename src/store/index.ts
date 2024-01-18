import { configureStore } from '@reduxjs/toolkit';

import { createAPI } from '../services/apiService/api';
import rootReducer from './root-reducer';
import { middlewareRedirect } from './middleware/middleware-redirect';

const api = createAPI();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      }
    }).concat(middlewareRedirect)
});

export default store;

