import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import type { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from 'src/config/ServiceConfig';
import { User } from '../User';
import { AccessToken, AuthTokens, IdToken, RefreshToken } from '../AuthTokens';
import { AuthenticationData } from '../AuthenticationData';
import { AuthenticationError } from '../AuthenticationError';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.userPool,
  ClientId: COGNITO_CONFIG.clientId,
});

const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

const parseTokens = (authSession: CognitoUserSession): AuthTokens => {
  const accessToken = new AccessToken(
    authSession.getAccessToken().getJwtToken(),
    authSession.getAccessToken().getExpiration(),
    authSession.getAccessToken().getIssuedAt(),
  );

  const idToken = new IdToken(
    authSession.getIdToken().getJwtToken(),
    authSession.getIdToken().getExpiration(),
    authSession.getIdToken().getIssuedAt(),
  );

  const refreshToken = new RefreshToken(authSession.getRefreshToken().getToken());

  return new AuthTokens(accessToken, refreshToken, idToken);
};

const parseUser = (idToken: CognitoIdToken): User => {
  const username: string = idToken.payload['cognito:username'];
  const name: string = idToken.payload.name;
  const email: string = idToken.payload.email;
  const emailVerified: boolean = idToken.payload.email_verified;
  const gender: string = idToken.payload.gender;

  return new User(username, name, email, emailVerified, gender);
};

const signIn = async (email: string, password: string): Promise<AuthenticationData> => {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authenticationData = { Username: email, Password: password };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return await new Promise((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (authSession) => {
        const tokens = parseTokens(authSession);
        const user = parseUser(authSession.getIdToken());

        const authData = new AuthenticationData(user, tokens);
        resolve(authData);
      },
      onFailure: (err) => {
        let errMsg: string;
        if (err instanceof Error) {
          errMsg = err.message;
        } else {
          errMsg = String(err);
        }
        reject(new AuthenticationError(errMsg));
      },
    });
  });
};

const signOut = async (): Promise<void> => {
  const user = getCurrentUser();

  await new Promise<void>((resolve, reject) => {
    if (user != null) {
      try {
        user.signOut();
        resolve();
      } catch (err) {
        let errMsg: string;
        if (err instanceof Error) {
          errMsg = err.message;
        } else {
          errMsg = String(err);
        }
        reject(new AuthenticationError(errMsg));
      }
    }
  });
};

const refreshAccessToken = (refreshTokenJwt: string): void => {
  const user = getCurrentUser();

  if (refreshTokenJwt != null && user != null) {
    console.log('refreshing token...');

    const cognitoRefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshTokenJwt,
    });

    user?.refreshSession(cognitoRefreshToken, (err, authSession) => {
      if (err != null) {
        throw new Error('Authenticaton Error: Refreshing of access token failed!');
      }

      const authTokens = parseTokens(authSession);
      const user = parseUser(authSession.getIdToken());
      console.log(authTokens);
      console.log(user);
    });
  }
};

const AuthServiceCognito = {
  signIn,
  signOut,
  refreshAccessToken,
};

export default AuthServiceCognito;
