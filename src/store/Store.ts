import { configureStore } from '@reduxjs/toolkit/';

import authSlice, { actions as authActions } from './AuthSlice';
import layoutSlice, { actions as layoutActions } from './LayoutSlice';
import toasterSlice, { actions as toasterActions, ToastMsg } from './ToasterSlice';
import WeightSlice, { actions as weightActions } from './WeightSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    layout: layoutSlice,
    toaster: toasterSlice,
    weight: WeightSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export { authActions, layoutActions, toasterActions, ToastMsg, weightActions };
export default store;

export type RootState = ReturnType<typeof store.getState>;
