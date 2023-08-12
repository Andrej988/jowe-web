import { configureStore } from '@reduxjs/toolkit/';

import authSlice, { actions as authActions, AuthState } from './AuthSlice';
import layoutSlice, { actions as layoutActions, LayoutState } from './LayoutSlice';
import toasterSlice, { actions as toasterActions, ToasterState, ToastMsg } from './ToasterSlice';
import WeightSlice, { actions as weightActions, WeightState } from './WeightSlice';

export interface ReduxStoreState {
  auth: AuthState;
  layour: LayoutState;
  toaster: ToasterState;
  weight: WeightState;
}

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
