import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import type { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from 'src/config/ServiceConfig';
import { AuthenticatedUser } from '../model/AuthenticatedUser';
import { AccessToken, AuthTokens, IdToken, RefreshToken } from '../model/AuthTokens';
import { AuthenticatedUserSession } from '../model/AuthenticatedUserSession';
import type { UserRegistrationRequest } from '../model/UserRegistrationRequest';
import {
  AccountConfirmationError,
  AuthenticationError,
  LogoutError,
  RegistrationError,
  TokenRefreshError,
  UserDeletionError,
  UserNotAuthenticatedError,
  UserNotConfirmedError,
} from '../errors/AuthenticationErrors';

export default class CognitoAuthService {
  private static readonly instance: CognitoAuthService = new CognitoAuthService();

  private readonly userPool = new CognitoUserPool({
    UserPoolId: COGNITO_CONFIG.userPool,
    ClientId: COGNITO_CONFIG.clientId,
  });

  public static getInstance(): CognitoAuthService {
    return this.instance;
  }

  private readonly parseCognitoUserSession = (
    userSession: CognitoUserSession,
  ): AuthenticatedUserSession => {
    const authenticatedUser = this.parseUser(userSession.getIdToken());
    const tokens = this.parseTokens(userSession);
    return new AuthenticatedUserSession(authenticatedUser, tokens);
  };

  private readonly parseTokens = (userSession: CognitoUserSession): AuthTokens => {
    const accessToken = new AccessToken(
      userSession.getAccessToken().getJwtToken(),
      userSession.getAccessToken().getExpiration(),
      userSession.getAccessToken().getIssuedAt(),
    );

    const idToken = new IdToken(
      userSession.getIdToken().getJwtToken(),
      userSession.getIdToken().getExpiration(),
      userSession.getIdToken().getIssuedAt(),
    );

    const refreshToken = new RefreshToken(userSession.getRefreshToken().getToken());

    return new AuthTokens(accessToken, refreshToken, idToken);
  };

  private readonly parseUser = (idToken: CognitoIdToken): AuthenticatedUser => {
    const username: string = idToken.payload['cognito:username'];
    const name: string = idToken.payload.name;
    const email: string = idToken.payload.email;
    const emailVerified: boolean = idToken.payload.email_verified;
    const gender: string = idToken.payload.gender;

    return new AuthenticatedUser(username, name, email, gender, emailVerified);
  };

  private readonly parseErrorMsg = (err: any): string => {
    let errMsg: string;
    if (err instanceof Error) {
      errMsg = err.message;
    } else {
      errMsg = String(err);
    }
    return errMsg;
  };

  private readonly buildSignUpUserAttributeList = (
    UserRegistrationReqData: UserRegistrationRequest,
  ): CognitoUserAttribute[] => {
    const attributeList: CognitoUserAttribute[] = [];

    attributeList.push(
      new CognitoUserAttribute({ Name: 'name', Value: UserRegistrationReqData.name }),
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: 'email', Value: UserRegistrationReqData.email }),
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: 'gender', Value: UserRegistrationReqData.gender }),
    );

    return attributeList;
  };

  signUp = async (userRegistrationReq: UserRegistrationRequest): Promise<string> => {
    const attributeList = this.buildSignUpUserAttributeList(userRegistrationReq);

    return await new Promise((resolve, reject) => {
      this.userPool.signUp(
        userRegistrationReq.username,
        userRegistrationReq.password,
        attributeList,
        [],
        (err, result) => {
          if (err != null) {
            reject(new RegistrationError(this.parseErrorMsg(err)));
          }

          const username = result?.user.getUsername();
          if (username != null) {
            resolve(username);
          } else {
            reject(new RegistrationError('Error retrieving username!'));
          }
        },
      );
    });
  };

  confirmAccount = async (username: string, confirmationCode: string): Promise<boolean> => {
    const user = this.buildCognitoUser(username);

    return await new Promise<boolean>((resolve, reject) => {
      user.confirmRegistration(confirmationCode, true, (err: any, result: any) => {
        if (err != null) {
          reject(new AccountConfirmationError(this.parseErrorMsg(err)));
        }
        resolve(true);
      });
    });
  };

  private readonly buildCognitoUser = (username: string): CognitoUser => {
    return new CognitoUser({ Username: username, Pool: this.userPool });
  };

  login = async (username: string, password: string): Promise<AuthenticatedUserSession> => {
    const user = this.buildCognitoUser(username);
    const authenticationData = { Username: username, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return await new Promise((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess: (userSession) => {
          const authenticatedUserSession = this.parseCognitoUserSession(userSession);
          resolve(authenticatedUserSession);
        },
        onFailure: (err) => {
          const errMsg = this.parseErrorMsg(err);
          if (err.name === 'UserNotConfirmedException') {
            reject(new UserNotConfirmedError(errMsg));
          } else {
            reject(new AuthenticationError(errMsg));
          }
        },
      });
    });
  };

  autoLogin = async (): Promise<AuthenticatedUserSession> => {
    const user = this.userPool.getCurrentUser();

    return await new Promise<AuthenticatedUserSession>((resolve, reject) => {
      if (user != null) {
        user.getSignInUserSession();
        user.getSession((err: Error | null, userSession: CognitoUserSession | null) => {
          if (err != null) {
            reject(new AuthenticationError(err.message));
          }

          if (userSession != null) {
            const authenticatedUserSession = this.parseCognitoUserSession(userSession);
            resolve(authenticatedUserSession);
          } else {
            reject(new UserNotAuthenticatedError('Could not retrieve user session!'));
          }
        });
      } else {
        reject(new UserNotAuthenticatedError('User is not signed in!'));
      }
    });
  };

  signOut = async (): Promise<void> => {
    const user = this.userPool.getCurrentUser();

    await new Promise<void>((resolve, reject) => {
      if (user != null) {
        user.getSignInUserSession();
        user.getSession((err: Error | null, userSession: CognitoUserSession | null) => {
          if (err == null) {
            user.globalSignOut({
              onSuccess() {
                console.debug('Global logout: Successful');
                resolve();
              },
              onFailure(err) {
                console.error(err);
                try {
                  user.signOut();
                  console.debug('Logout: Successful');
                  resolve();
                } catch (err) {
                  console.error(err);
                  reject(err);
                }
              },
            });
          } else {
            try {
              user.signOut();
              console.debug('Logout: Successful');
              resolve();
            } catch (err) {
              reject(new LogoutError(this.parseErrorMsg(err)));
            }
          }
        });
      }
    });
  };

  deleteUser = async (): Promise<string> => {
    const user = this.userPool.getCurrentUser();

    return await new Promise<string>((resolve, reject) => {
      if (user != null) {
        user.getSignInUserSession();
        user.getSession((err: any) => {
          if (err != null) {
            reject(new UserNotAuthenticatedError(err.message));
          }
          user.deleteUser((err2: any, result: any) => {
            if (err2 != null) {
              reject(new UserDeletionError(err.message));
            }
            resolve(result != null ? result : 'SUCCESS');
          });
        });
      } else {
        reject(new UserNotAuthenticatedError('User is not signed in!'));
      }
    });
  };

  refreshAccessToken = async (refreshTokenJwt: string): Promise<AuthenticatedUserSession> => {
    const user = this.userPool.getCurrentUser();

    return await new Promise<AuthenticatedUserSession>((resolve, reject) => {
      console.info('Started refresh tokens flow...');

      if (user == null) {
        reject(new UserNotAuthenticatedError('Failed to refresh access token: User is null...'));
      }

      const cognitoRefreshToken = new CognitoRefreshToken({
        RefreshToken: refreshTokenJwt,
      });

      user?.refreshSession(cognitoRefreshToken, (err, userSession) => {
        if (err != null) {
          reject(new TokenRefreshError('Refreshing of access token failed!'));
        }

        const autenticatedUserSession = this.parseCognitoUserSession(userSession);
        resolve(autenticatedUserSession);
      });
    });
  };
}
