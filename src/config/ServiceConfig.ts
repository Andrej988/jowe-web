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

export const CONFIRMATION_CODE_FEEDBACK =
  'Please enter a valid confirmation code received via email.';
export const PASSWORD_POLICY_STRING =
  'Passwords must be at least 8 characters long and must contain at least one number, one special character, one uppercase letter and one lowercase letter.';
export const PASSWORD_POLICY_FEEDBACK =
  'Please check if password is according to the password policy below';
export const PASSWORD_CONFIRMATION_FEEDBACK =
  'New password must be according to rules and confirmation must match new password.';
