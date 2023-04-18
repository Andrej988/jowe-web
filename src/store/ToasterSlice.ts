import { createSlice } from '@reduxjs/toolkit';

export class ToastMsg {
  constructor(public icon: string | string[], public title: string, public messsage: string) {}
}

interface ToasterState {
  toasts: ToastMsg[];
}

const initialState: ToasterState = {
  toasts: [],
};

const addToastMsg = (state: ToasterState, toastMsg: ToastMsg): void => {
  const newToasts = [...state.toasts];
  newToasts.push(toastMsg);
  state.toasts = newToasts;
};

const removeToastMsg = (state: ToasterState): void => {
  if (state.toasts.length > 0) {
    const newToasts = [...state.toasts];
    newToasts.shift();
    state.toasts = newToasts;
  }
};

const toasterSlice = createSlice({
  name: 'toaster',
  initialState,
  reducers: {
    addMessage(state, action) {
      addToastMsg(state, action.payload);
    },
    removeMessage(state) {
      removeToastMsg(state);
    },
  },
});

export const actions = toasterSlice.actions;
export default toasterSlice.reducer;
