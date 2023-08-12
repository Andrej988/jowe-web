import { createSlice } from '@reduxjs/toolkit';

export interface LayoutState {
  showSidebar: boolean;
}

const initialState: LayoutState = {
  showSidebar: true,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebarVisibility(state) {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const actions = layoutSlice.actions;
export default layoutSlice.reducer;
