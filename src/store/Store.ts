import { configureStore } from '@reduxjs/toolkit/';

import authSlice, { actions as authActions } from './AuthSlice';
import layoutSlice, { actions as layoutActions } from './LayoutSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    layout: layoutSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export { authActions, layoutActions };
export default store;

export type RootState = ReturnType<typeof store.getState>;
