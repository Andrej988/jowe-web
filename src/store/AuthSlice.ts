import { createSlice } from '@reduxjs/toolkit';
import { AuthTokens } from '../services/auth/model/AuthTokens';
import { AuthenticatedUser } from 'src/services/auth/model/AuthenticatedUser';

export interface AuthState {
  isAuthenticated?: boolean;
  user?: AuthenticatedUser;
  tokens?: AuthTokens;
  autoLogoutAt?: number;
}

const initialState: AuthState = {
  isAuthenticated: undefined,
  user: new AuthenticatedUser(),
  tokens: new AuthTokens(),
  autoLogoutAt: undefined,
};

const setAuthState = (
  state: AuthState,
  isAuthenticated: boolean,
  user?: AuthenticatedUser,
  tokens?: AuthTokens,
  autoLogoutTime?: number,
): void => {
  state.isAuthenticated = isAuthenticated;
  if (isAuthenticated) {
    state.user = user;
    state.tokens = tokens;
    if (state.autoLogoutAt === undefined) {
      state.autoLogoutAt = autoLogoutTime;
    }
  } else {
    state.user = undefined;
    state.tokens = new AuthTokens();
    state.autoLogoutAt = undefined;
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
