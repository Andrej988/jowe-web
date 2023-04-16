import store, { authActions } from '../store/Store';
import type { AuthenticationData } from './model/AuthenticationData';
import { AuthenticationError } from './errors/AuthenticationError';
import type { AuthenticatedUser, UserRegistrationReqData } from './model/UserData';
import AuthServiceCognito from './provider/AuthServiceCognito';

export default class AuthService {
  private static readonly instance: AuthService = new AuthService();
  private static readonly USER_DATA_STORAGE_KEY = 'WeightTrackerUserData';
  private refreshTokenTimer: NodeJS.Timeout | undefined;

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

  private readonly handleLogin = (authenticationData: AuthenticationData): void => {
    console.log('handling login');
    store.dispatch(
      authActions.signIn({
        isAuthenticated: true,
        user: authenticationData.user,
        tokens: authenticationData.tokens,
      }),
    );
    if (
      authenticationData.tokens.refreshToken?.token != null &&
      authenticationData.tokens.accessToken?.expiration != null
    ) {
      this.setRefreshTokenTimer(
        authenticationData.tokens.refreshToken?.token,
        authenticationData.tokens.accessToken?.expiration,
      );
    }
  };

  private readonly storeAuthDataInLocalStorage = (authenticationData: AuthenticationData): void => {
    localStorage.setItem(AuthService.USER_DATA_STORAGE_KEY, JSON.stringify(authenticationData));
  };

  private readonly setRefreshTokenTimer = (
    refreshToken: string,
    tokenExpirationTimestamp: number,
  ): void => {
    const tokenExpirationDate = new Date((tokenExpirationTimestamp - 90) * 1000);
    const expirationDuration = new Date(tokenExpirationDate).getTime() - new Date().getTime();
    console.log('new refresh will be at:', new Date(new Date().getTime() + expirationDuration));
    this.refreshTokenTimer = setTimeout(() => {
      console.log('refreshing access token');
      AuthServiceCognito.refreshAccessToken(refreshToken)
        .then((authData: AuthenticationData) => {
          console.log('Tokens refreshed....');
          this.handleLogin(authData);
          this.storeAuthDataInLocalStorage(authData);
        })
        .catch((err) => {
          throw new AuthenticationError(err.msg);
        });
    }, expirationDuration);
  };

  login = async (enteredUsername: string, enteredPassword: string): Promise<AuthenticationData> => {
    return await new Promise<AuthenticationData>((resolve, reject) => {
      AuthServiceCognito.signIn(enteredUsername, enteredPassword)
        .then((authenticationData) => {
          this.handleLogin(authenticationData);
          this.storeAuthDataInLocalStorage(authenticationData);
          resolve(authenticationData);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  };

  autoLogin = async (): Promise<AuthenticationData> => {
    return await new Promise<AuthenticationData>((resolve, reject) => {
      const userSessionObj = localStorage.getItem(AuthService.USER_DATA_STORAGE_KEY);
      if (userSessionObj != null) {
        const authenticatedUserSession: AuthenticationData = JSON.parse(userSessionObj);

        if (authenticatedUserSession.tokens.accessToken?.expiration != null) {
          const expirationDate = new Date(
            authenticatedUserSession.tokens.accessToken?.expiration * 1000,
          );
          console.log('auth token expires: ', expirationDate);

          if (Date.now() < authenticatedUserSession.tokens.accessToken?.expiration * 1000) {
            this.handleLogin(authenticatedUserSession);
            resolve(authenticatedUserSession);
          } else {
            this.logout()
              .then(() => {})
              .catch((err) => {
                reject(new AuthenticationError(err.message));
              });
          }
        }
      } else {
        store.dispatch(authActions.signOut());
      }
    });
  };

  logout = async (): Promise<void> => {
    await AuthServiceCognito.signOut().then(() => {
      store.dispatch(authActions.signOut());
      localStorage.removeItem(AuthService.USER_DATA_STORAGE_KEY);
      if (this.refreshTokenTimer != null) {
        clearTimeout(this.refreshTokenTimer);
      }
    });
  };

  getAccessToken = (): string => {
    const tokens = store.getState().auth.tokens;
    return tokens.idToken?.token !== undefined ? tokens.idToken.token : '';
  };

  getUserData = (): AuthenticatedUser => {
    return store.getState().auth.user;
  };
}
