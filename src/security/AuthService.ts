import store, { authActions } from '../store/Store';
import type { AuthenticationData } from './AuthenticationData';
import { AuthenticationError } from './AuthenticationError';
import type { UserRegistrationReqData } from './User';
import AuthServiceCognito from './provider/AuthServiceCognito2';

export default class AuthService {
  private static readonly instance: AuthService = new AuthService();
  private readonly USER_DATA_STORAGE_KEY = 'WeightTrackerUserData';

  public static getInstance(): AuthService {
    return this.instance;
  }

  signUp = async (userRegistrationReq: UserRegistrationReqData): Promise<string> => {
    return await new Promise<any>((resolve, reject) => {
      AuthServiceCognito.signUp(userRegistrationReq)
        .then((username: string) => {
          resolve(username);
        })
        .catch((err: Error) => {
          reject(new AuthenticationError(err.message, err.stack));
        });
    });
  };

  checkIfUserAlreadySignedIn = async (): Promise<void> => {
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

  confirmAccount = async (username: string, confirmationCode: string): Promise<boolean> => {
    return await new Promise<any>((resolve, reject) => {
      AuthServiceCognito.confirmAccount(username, confirmationCode)
        .then(() => {
          resolve(true);
        })
        .catch((err: Error) => {
          reject(new AuthenticationError(err.message, err.stack));
        });
    });
  };

  signIn = async (
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
          localStorage.setItem(this.USER_DATA_STORAGE_KEY, JSON.stringify(authenticationData));
          resolve(authenticationData);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  };

  signOut = async (): Promise<void> => {
    await AuthServiceCognito.signOut().then(() => {
      store.dispatch(authActions.signOut());
      localStorage.removeItem(this.USER_DATA_STORAGE_KEY);
    });
  };

  getAccessToken = (): string => {
    const tokens = store.getState().auth.tokens;
    return tokens.idToken?.token !== undefined ? tokens.idToken.token : '';
  };
}
