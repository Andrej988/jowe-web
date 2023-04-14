import { Auth } from 'aws-amplify';
import type { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AccessToken, AuthTokens, RefreshToken } from './../AuthTokens';
import { AuthenticationError } from '../AuthenticationError';

const signIn = async (username: string, password: string): Promise<string> => {
  return await Auth.signIn(username, password)
    .then((user) => user.username)
    .catch((err) => {
      throw new AuthenticationError(err.message, err.stack);
    });
};

const signOut = async (): Promise<void> => {
  await Auth.signOut().catch((err) => {
    const errMsg: string = err.message;
    console.error('Error signing in: ' + errMsg);
  });
};

const getAuthenticatedUser = async (): Promise<string> => {
  return await Auth.currentAuthenticatedUser().then((user) => {
    return user.username;
  });
};

const getAuthTokens = async (): Promise<AuthTokens> => {
  return await Auth.currentSession()
    .then((userSession) => {
      return mapCognitoUserSessionDataToAuthTokens(userSession);
    })
    .catch((err) => {
      throw new AuthenticationError(err.message, err.stack);
    });
};

const mapCognitoUserSessionDataToAuthTokens = (userSession: CognitoUserSession): AuthTokens => {
  const accessToken = new AccessToken(
    userSession.getAccessToken().getJwtToken(),
    userSession.getAccessToken().getExpiration(),
    userSession.getAccessToken().getIssuedAt(),
  );
  const refreshToken = new RefreshToken(userSession.getRefreshToken().getToken());
  const idToken = new AccessToken(
    userSession.getIdToken().getJwtToken(),
    userSession.getIdToken().getExpiration(),
    userSession.getIdToken().getIssuedAt(),
  );
  return new AuthTokens(accessToken, refreshToken, idToken);
};

const AuthServiceCognito = {
  signIn,
  signOut,
  getAuthenticatedUser,
  getAuthTokens,
};

export default AuthServiceCognito;
