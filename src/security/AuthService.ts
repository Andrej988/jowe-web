import store, { authActions } from '../store/Store';
import { AuthenticationError } from './AuthenticationError';
import AuthServiceCognito from './provider/AuthServiceCognito';

const checkIfUserAlreadySignedIn = async () => {
  let username: string = '';

  await AuthServiceCognito.getAuthenticatedUser()
    .then((user) => {
      username = user;
      return AuthServiceCognito.getAuthTokens();
    })
    .then((tokens) => {
      store.dispatch(
        authActions.signIn({
          isAuthenticated: true,
          username: username,
          tokens: tokens,
        }),
      );
    })
    .catch((err) => {
      store.dispatch(authActions.signOut());
    });
};

const signIn = async (enteredUsername: string, enteredPassword: string) => {
  let username: string = '';

  await AuthServiceCognito.signIn(enteredUsername, enteredPassword)
    .then((user) => {
      username = user;
      return AuthServiceCognito.getAuthTokens();
    })
    .then((tokens) => {
      store.dispatch(
        authActions.signIn({
          isAuthenticated: true,
          username: username,
          tokens: tokens,
        }),
      );
    })
    .catch((err: Error) => {
      console.error(err.message);
      throw new AuthenticationError(err.message, err.stack);
    });
};

const signOut = async () => {
  await AuthServiceCognito.signOut().then(() => {
    store.dispatch(authActions.signOut());
  });
};

const getAccessToken = (): string => {
  const tokens = store.getState().auth.tokens;

  return tokens.idToken !== undefined && tokens.idToken.token !== undefined
    ? tokens.idToken.token
    : '';
};

const AuthService = {
  checkIfUserAlreadySignedIn,
  signIn,
  signOut,
  getAccessToken,
};

export default AuthService;
