import { CognitoConfig } from 'src/security/provider/CognitoConfig';

export const SERVICE_URL: string | undefined = process.env.REACT_APP_WEIGHT_TRACKER_SERVICE_URL;
export const COGNITO_CONFIG = new CognitoConfig(
  process.env.REACT_APP_COGNITO_USER_POOL_ID,
  process.env.REACT_APP_COGNITO_CLIENT_ID,
);
