import { createSlice } from '@reduxjs/toolkit';
import { AuthTokens } from '../security/AuthTokens';

const initialState = {
  isAuthenticated: null,
  username: '',
  tokens: new AuthTokens(),
};

const setAuthState = (
  state: any,
  isAuthenticated: boolean,
  username: string,
  tokens: AuthTokens | null,
): void => {
  state.isAuthenticated = isAuthenticated;
  if (isAuthenticated) {
    state.username = username;
    state.tokens = tokens;
  } else {
    state.username = null;
    state.tokens = new AuthTokens();
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action) {
      setAuthState(
        state,
        action.payload.isAuthenticated,
        action.payload.username,
        action.payload.tokens,
      );
    },
    signOut(state) {
      setAuthState(state, false, '', null);
    },
  },
});

export const actions = authSlice.actions;
export default authSlice.reducer;
