import store, { authActions } from '../store/Store';
import { AuthenticationError } from './AuthenticationError';
import AuthServiceCognito from './provider/AuthServiceCognito';

const checkIfUserAlreadySignedIn = async (): Promise<void> => {
  let username: string = '';

  await AuthServiceCognito.getAuthenticatedUser()
    .then(async (user) => {
      username = user;
      return await AuthServiceCognito.getAuthTokens();
    })
    .then((tokens) => {
      store.dispatch(
        authActions.signIn({
          isAuthenticated: true,
          username,
          tokens,
        }),
      );
    })
    .catch((err) => {
      console.error(err);
      store.dispatch(authActions.signOut());
    });
};

const signIn = async (enteredUsername: string, enteredPassword: string): Promise<void> => {
  let username: string = '';

  await AuthServiceCognito.signIn(enteredUsername, enteredPassword)
    .then(async (user) => {
      username = user;
      return await AuthServiceCognito.getAuthTokens();
    })
    .then((tokens) => {
      store.dispatch(
        authActions.signIn({
          isAuthenticated: true,
          username,
          tokens,
        }),
      );
    })
    .catch((err: Error) => {
      console.error(err.message);
      throw new AuthenticationError(err.message, err.stack);
    });
};

const signOut = async (): Promise<void> => {
  await AuthServiceCognito.signOut().then(() => {
    store.dispatch(authActions.signOut());
  });
};

const getAccessToken = (): string => {
  const tokens = store.getState().auth.tokens;

  return tokens.idToken?.token !== undefined ? tokens.idToken.token : '';
};

const AuthService = {
  checkIfUserAlreadySignedIn,
  signIn,
  signOut,
  getAccessToken,
};

export default AuthService;
