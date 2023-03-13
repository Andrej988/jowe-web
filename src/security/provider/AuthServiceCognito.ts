import { Auth } from 'aws-amplify';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AccessToken, AuthTokens, RefreshToken } from './../AuthTokens';

const signIn = async (username: string, password: string): Promise<string> => {
  try {
    const user = await Auth.signIn(username, password);
    return user.username;
  } catch (error) {
    console.log('error signing in', error);
    throw new Error('Authentication error');
  }
};

const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
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
      console.error(err);
      throw new Error('Error retrieving user info!');
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
