import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import type { CognitoUserSession, CognitoIdToken } from 'amazon-cognito-identity-js';
import { COGNITO_CONFIG } from 'src/config/ServiceConfig';
import { AuthenticatedUser } from '../User';
import type { UserRegistrationReqData } from '../User';
import { AccessToken, AuthTokens, IdToken, RefreshToken } from '../AuthTokens';
import { AuthenticationData } from '../AuthenticationData';
import { AuthenticationError } from '../AuthenticationError';
import { UserNotConfirmedError } from '../UserNotConfirmedError';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.userPool,
  ClientId: COGNITO_CONFIG.clientId,
});

const buildCognitoUser = (username: string): CognitoUser => {
  return new CognitoUser({ Username: username, Pool: userPool });
};

const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

const getErrorMsg = (err: any): string => {
  let errMsg: string;
  if (err instanceof Error) {
    errMsg = err.message;
  } else {
    errMsg = String(err);
  }
  return errMsg;
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

const parseUser = (idToken: CognitoIdToken): AuthenticatedUser => {
  const username: string = idToken.payload['cognito:username'];
  const name: string = idToken.payload.name;
  const email: string = idToken.payload.email;
  const emailVerified: boolean = idToken.payload.email_verified;
  const gender: string = idToken.payload.gender;

  return new AuthenticatedUser(username, name, email, gender, emailVerified);
};

const buildSignUpUserAttributeList = (
  UserRegistrationReqData: UserRegistrationReqData,
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

const signUp = async (userRegistrationReq: UserRegistrationReqData): Promise<string> => {
  const attributeList = buildSignUpUserAttributeList(userRegistrationReq);

  return await new Promise((resolve, reject) => {
    userPool.signUp(
      userRegistrationReq.username,
      userRegistrationReq.password,
      attributeList,
      [],
      (err, result) => {
        if (err != null) {
          reject(new AuthenticationError(getErrorMsg(err)));
        }

        const username = result?.user.getUsername();
        if (username != null) {
          resolve(username);
        } else {
          reject(new AuthenticationError('Error retrieving username!'));
        }
      },
    );
  });
};

const confirmAccount = async (username: string, confirmationCode: string): Promise<boolean> => {
  const user = buildCognitoUser(username);

  return await new Promise<boolean>((resolve, reject) => {
    user.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err != null) {
        reject(new AuthenticationError(getErrorMsg(err)));
      }
      resolve(true);
    });
  });
};

const signIn = async (username: string, password: string): Promise<AuthenticationData> => {
  const user = buildCognitoUser(username);
  const authenticationData = { Username: username, Password: password };
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
        const errMsg = getErrorMsg(err);
        if (err.name === 'UserNotConfirmedException') {
          reject(new UserNotConfirmedError(errMsg));
        } else {
          reject(new AuthenticationError(errMsg));
        }
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
        reject(new AuthenticationError(getErrorMsg(err)));
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
  signUp,
  confirmAccount,
  signIn,
  signOut,
  refreshAccessToken,
};

export default AuthServiceCognito;
