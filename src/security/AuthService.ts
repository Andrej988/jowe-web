import store, { authActions } from '../store/Store';
import type { AuthenticationData } from './AuthenticationData';
import { AuthenticationError } from './AuthenticationError';
// import { AuthenticationError } from './AuthenticationError';
import AuthServiceCognito from './provider/AuthServiceCognito2';

const checkIfUserAlreadySignedIn = async (): Promise<void> => {
  store.dispatch(authActions.signOut());
  /* let username: string = '';

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
    }); */
};

const signUp = async (enteredUsername: string, enteredPassword: string): Promise<void> => {
  console.log(enteredUsername);
  console.log(enteredPassword);
};

const signIn = async (
  enteredUsername: string,
  enteredPassword: string,
): Promise<AuthenticationData> => {
  return await new Promise<AuthenticationData>((resolve, reject) => {
    AuthServiceCognito.signIn(enteredUsername, enteredPassword)
      .then((authenticationData) => {
        store.dispatch(
          authActions.signIn({
            isAuthenticated: true,
            user: authenticationData.user,
            tokens: authenticationData.tokens,
          }),
        );
        resolve(authenticationData);
      })
      .catch((err: Error) => {
        reject(new AuthenticationError(err.message, err.stack));
      });
  });

  /* await AuthServiceCognito.signIn(enteredUsername, enteredPassword)
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
    }); */
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
  signUp,
  signIn,
  signOut,
  getAccessToken,
};

export default AuthService;
