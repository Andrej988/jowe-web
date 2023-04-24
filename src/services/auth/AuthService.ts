import store, { authActions } from '../../store/Store';
import type { AuthenticatedUserSession } from './model/AuthenticatedUserSession';
import type { AuthenticatedUser } from './model/AuthenticatedUser';
import CognitoAuthService from './provider/CognitoAuthService';
import type { UserRegistrationRequest } from './model/UserRegistrationRequest';
import {
  AuthenticationError,
  ForgotPasswordFlowException,
  UserNotAuthenticatedError,
  UserSessionExpiredError,
} from './errors/AuthenticationErrors';

export default class AuthService {
  private static readonly instance: AuthService = new AuthService();
  private static readonly AUTO_LOGOUT_AFTER = 3600000; // 1 hour
  public static readonly SHOW_SESSION_PROLONGATION_FORM = 30000; // 30 seconds before

  private refreshTokenTimer: NodeJS.Timeout | undefined;
  private autoLogoutTimer: NodeJS.Timeout | undefined;

  public static getInstance(): AuthService {
    return this.instance;
  }

  async signUp(userRegistrationReq: UserRegistrationRequest): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .signUp(userRegistrationReq)
        .then((username: string) => {
          resolve(username);
        })
        .catch((err: Error) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  async confirmAccount(username: string, confirmationCode: string): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .confirmAccount(username, confirmationCode)
        .then(() => {
          resolve(true);
        })
        .catch((err: Error) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  async resendSignupConfirmationCode(username: string): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .resendSignupConfirmationCode(username)
        .then(() => {
          resolve(true);
        })
        .catch((err: Error) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  private handleLogin(authenticationData: AuthenticatedUserSession, autoLogoutTime?: number): void {
    store.dispatch(
      authActions.signIn({
        isAuthenticated: true,
        user: authenticationData.user,
        tokens: authenticationData.tokens,
        autoLogoutTime,
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
  }

  private setRefreshTokenTimer(refreshToken: string, tokenExpirationTimestamp: number): void {
    const tokenExpirationDate = new Date((tokenExpirationTimestamp - 90) * 1000);
    const expirationDuration = new Date(tokenExpirationDate).getTime() - new Date().getTime();
    console.debug(
      'Next refresh of access token will be at:',
      new Date(new Date().getTime() + expirationDuration),
    );
    this.refreshTokenTimer = setTimeout(() => {
      console.info('Refreshing tokens...');

      CognitoAuthService.getInstance()
        .refreshAccessToken(refreshToken)
        .then((authData: AuthenticatedUserSession) => {
          console.info('Tokens refreshed....');
          this.handleLogin(authData);
        })
        .catch((err) => {
          console.error(err.message);
          throw new AuthenticationError(err.msg);
        });
    }, expirationDuration);
  }

  async login(enteredUsername: string, enteredPassword: string): Promise<AuthenticatedUserSession> {
    return await new Promise<AuthenticatedUserSession>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .login(enteredUsername, enteredPassword)
        .then((authenticationData) => {
          this.handleLogin(authenticationData, Date.now() + AuthService.AUTO_LOGOUT_AFTER);
          this.setAutoLogout();
          return authenticationData;
        })
        .then((authenticationData) => {
          resolve(authenticationData);
        })
        .catch((err: Error) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  async autoLogin(): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .autoLogin()
        .then((userSession: AuthenticatedUserSession) => {
          if (userSession.tokens.accessToken?.expiration != null) {
            const expirationDate = new Date(userSession.tokens.accessToken?.expiration * 1000);
            console.debug('Access token expires on: ', expirationDate);

            if (Date.now() < userSession.tokens.accessToken?.expiration * 1000) {
              this.handleLogin(userSession, Date.now() + AuthService.AUTO_LOGOUT_AFTER);
              this.setAutoLogout();
              resolve(true);
            } else {
              throw new UserSessionExpiredError('Session expired!');
            }
          } else {
            throw new UserNotAuthenticatedError('Missing user session data!');
          }
        })
        .catch((err: Error) => {
          this.handleLogout();
          reject(err);
        });
    });
  }

  private setAutoLogout(): void {
    this.autoLogoutTimer = setTimeout(() => {
      this.logout().catch((err) => {
        console.error(err);
      });
    }, AuthService.AUTO_LOGOUT_AFTER);
  }

  private clearAutoLogoutTimer(): void {
    if (this.autoLogoutTimer !== undefined) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = undefined;
    }
  }

  private clearRefreshTokenTimer(): void {
    if (this.refreshTokenTimer !== undefined) {
      clearTimeout(this.refreshTokenTimer);
      this.refreshTokenTimer = undefined;
    }
  }

  private handleLogout(): void {
    store.dispatch(authActions.signOut());
    this.clearRefreshTokenTimer();
    this.clearAutoLogoutTimer();
  }

  async logout(): Promise<void> {
    await CognitoAuthService.getInstance()
      .signOut()
      .then(() => {
        this.handleLogout();
      });
  }

  async deleteUser(): Promise<boolean> {
    return await new Promise<boolean>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .deleteUser()
        .then(() => {
          this.handleLogout();
        })
        .then(() => {
          // TODO: Implement deletion of all user data from dynamo DB!!!
          resolve(true);
        })
        .catch((err) => {
          console.error(err.message);
          reject(err);
        });
    });
  }

  getAccessToken(): string {
    const tokens = store.getState().auth.tokens;
    return tokens.idToken?.token !== undefined ? tokens.idToken.token : '';
  }

  getUserData(): AuthenticatedUser {
    return store.getState().auth.user;
  }

  async initForgotPasswordFlos(username: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .initForgotPasswordFlow(username)
        .then((res) => {
          resolve();
        })
        .catch((err) => {
          reject(new ForgotPasswordFlowException(err.message));
        });
    });
  }

  async completeForgotPasswordFlow(
    username: string,
    verificationCode: string,
    newPassword: string,
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .completeForgotPasswordFlow(username, verificationCode, newPassword)
        .then((res) => {
          resolve();
        })
        .catch((err) => {
          reject(new ForgotPasswordFlowException(err.message));
        });
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      CognitoAuthService.getInstance()
        .changePassword(oldPassword, newPassword)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  extendUserSession(): void {
    this.clearAutoLogoutTimer();
    store.dispatch(
      authActions.setNewAutoLogoutAt({
        autoLogoutTime: Date.now() + AuthService.AUTO_LOGOUT_AFTER,
      }),
    );
    this.setAutoLogout();
  }
}
