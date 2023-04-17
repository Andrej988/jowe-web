import { CognitoConfig } from 'src/auth/provider/CognitoConfig';
import { PasswordPolicy } from './PasswordPolicy';

export const SERVICE_URL: string | undefined = process.env.REACT_APP_WEIGHT_TRACKER_SERVICE_URL;

export const ALLOW_SIGN_UP: boolean =
  process.env.REACT_APP_ALLOW_SIGN_UP != null
    ? Boolean(process.env.REACT_APP_ALLOW_SIGN_UP)
    : false;

export const COGNITO_CONFIG = new CognitoConfig(
  process.env.REACT_APP_COGNITO_USER_POOL_ID,
  process.env.REACT_APP_COGNITO_CLIENT_ID,
);

export const PASSWORD_POLICY: PasswordPolicy[] = [
  PasswordPolicy.AT_LEAST_8_CHARS,
  PasswordPolicy.AT_LEAST_1_NUMBER,
  PasswordPolicy.AT_LEAST_1_SPECIAL_CHARACTER,
  PasswordPolicy.AT_LEAST_1_UPPERCASE_CHAR,
  PasswordPolicy.AT_LEAST_1_LOWERCASE_CHAR,
];

export const AWS_CONFIRMATION_CODE_MIN_LENGTH = 6;
export const AWS_CONFIRMATION_CODE_MAX_LENGTH = 10;

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 20;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 30;
