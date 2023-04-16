import { CognitoConfig } from 'src/auth/provider/CognitoConfig';

export const SERVICE_URL: string | undefined = process.env.REACT_APP_WEIGHT_TRACKER_SERVICE_URL;
export const COGNITO_CONFIG = new CognitoConfig(
  process.env.REACT_APP_COGNITO_USER_POOL_ID,
  process.env.REACT_APP_COGNITO_CLIENT_ID,
);

export const ALLOW_SIGN_UP: boolean =
  process.env.REACT_APP_ALLOW_SIGN_UP != null
    ? Boolean(process.env.REACT_APP_ALLOW_SIGN_UP)
    : false;

export const PASSWORD_RULES_STRING =
  'Passwords must be at least 8 characters long and must contain at least one number, one special character, one uppercase letter and one lowercase letter.';
