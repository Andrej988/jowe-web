import { createSlice } from '@reduxjs/toolkit';
import { AuthTokens } from '../auth/model/AuthTokens';
import { AuthenticatedUser } from 'src/auth/model/UserData';

const initialState = {
  isAuthenticated: null,
  user: new AuthenticatedUser(),
  tokens: new AuthTokens(),
};

const setAuthState = (
  state: any,
  isAuthenticated: boolean,
  user: AuthenticatedUser | null,
  tokens: AuthTokens | null,
): void => {
  state.isAuthenticated = isAuthenticated;
  if (isAuthenticated) {
    state.user = user;
    state.tokens = tokens;
  } else {
    state.user = null;
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
        action.payload.user,
        action.payload.tokens,
      );
    },
    signOut(state) {
      setAuthState(state, false, null, null);
    },
  },
});

export const actions = authSlice.actions;
export default authSlice.reducer;
