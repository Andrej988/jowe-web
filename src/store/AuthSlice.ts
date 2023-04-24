import { createSlice } from '@reduxjs/toolkit';
import { AuthTokens } from '../services/auth/model/AuthTokens';
import { AuthenticatedUser } from 'src/services/auth/model/AuthenticatedUser';

const initialState = {
  isAuthenticated: null,
  user: new AuthenticatedUser(),
  tokens: new AuthTokens(),
  autoLogoutAt: null,
};

const setAuthState = (
  state: any,
  isAuthenticated: boolean,
  user?: AuthenticatedUser,
  tokens?: AuthTokens,
  autoLogoutTime?: number,
): void => {
  state.isAuthenticated = isAuthenticated;
  if (isAuthenticated) {
    state.user = user;
    state.tokens = tokens;
    if (state.autoLogoutAt === null) {
      state.autoLogoutAt = autoLogoutTime;
    }
  } else {
    state.user = null;
    state.tokens = new AuthTokens();
    state.autoLogoutAt = null;
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
        action.payload.autoLogoutTime,
      );
    },
    signOut(state) {
      setAuthState(state, false);
    },
    setNewAutoLogoutAt(state, action) {
      state.autoLogoutAt = action.payload.autoLogoutTime;
    },
  },
});

export const actions = authSlice.actions;
export default authSlice.reducer;
