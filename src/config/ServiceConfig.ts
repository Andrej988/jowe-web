import { PasswordPolicy, PasswordPolicyDetail } from 'src/services/auth/PasswordPolicy';
import { CognitoConfig } from 'src/services/auth/provider/CognitoConfig';

export const SERVICE_URL: string | undefined = process.env.REACT_APP_HEALTH_TRACKER_SERVICE_URL;

export const ALLOW_SIGN_UP: boolean =
  process.env.REACT_APP_ALLOW_SIGN_UP != null
    ? Boolean(process.env.REACT_APP_ALLOW_SIGN_UP)
    : false;

export const COGNITO_CONFIG = new CognitoConfig(
  process.env.REACT_APP_COGNITO_USER_POOL_ID,
  process.env.REACT_APP_COGNITO_CLIENT_ID,
);

export const PASSWORD_POLICY = new PasswordPolicy(8, [
  PasswordPolicyDetail.AT_LEAST_1_NUMBER,
  PasswordPolicyDetail.AT_LEAST_1_UPPERCASE_CHAR,
  PasswordPolicyDetail.AT_LEAST_1_LOWERCASE_CHAR,
  PasswordPolicyDetail.AT_LEAST_1_SPECIAL_CHARACTER,
]);

export const AWS_CONFIRMATION_CODE_MIN_LENGTH = 6;
export const AWS_CONFIRMATION_CODE_MAX_LENGTH = 10;

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 20;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 30;
