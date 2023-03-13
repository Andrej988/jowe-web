import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showSidebar: true,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState: initialState,
  reducers: {
    toggleSidebarVisibility(state) {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const actions = layoutSlice.actions;
export default layoutSlice.reducer;
