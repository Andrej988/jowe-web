import { configureStore } from '@reduxjs/toolkit/';

import authSlice, { actions as authActions, AuthState } from './AuthSlice';
import layoutSlice, { actions as layoutActions, LayoutState } from './LayoutSlice';
import mealPlannerSlice, {
  actions as mealPlannerActions,
  MealPlannerState,
} from './MealPlannerSlice';
import toasterSlice, { actions as toasterActions, ToasterState, ToastMsg } from './ToasterSlice';
import WeightSlice, { actions as weightActions, WeightState } from './WeightSlice';

export interface ReduxStoreState {
  auth: AuthState;
  layour: LayoutState;
  mealPlanner: MealPlannerState;
  toaster: ToasterState;
  weight: WeightState;
}

const store = configureStore({
  reducer: {
    auth: authSlice,
    layout: layoutSlice,
    mealPlanner: mealPlannerSlice,
    toaster: toasterSlice,
    weight: WeightSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export { authActions, layoutActions, mealPlannerActions, toasterActions, ToastMsg, weightActions };
export default store;

export type RootState = ReturnType<typeof store.getState>;
