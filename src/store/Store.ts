import { configureStore } from '@reduxjs/toolkit/';

import authSlice, { actions as authActions } from './AuthSlice';
import layoutSlice, { actions as layoutActions } from './LayoutSlice';
import toasterSlice, { actions as toasterActions, ToastMsg } from './ToasterSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    layout: layoutSlice,
    toaster: toasterSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export { authActions, layoutActions, toasterActions, ToastMsg };
export default store;

export type RootState = ReturnType<typeof store.getState>;
