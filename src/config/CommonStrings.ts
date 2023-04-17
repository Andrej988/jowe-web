import { NAME_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from './ServiceConfig';

export const CONFIRMATION_CODE_FEEDBACK =
  'Please enter a valid verification code received via email.';

export const PASSWORD_POLICY_FEEDBACK =
  'Please check if password is according to the password policy below';
export const PASSWORD_CONFIRMATION_FEEDBACK = 'Passwords do not match.';

export const NAME_FEEDBACK = `Name is mandatory and should not exceed ${NAME_MAX_LENGTH} characters.`;
export const USERNAME_FEEDBACK = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long and must contain only letters, numbers, or the special characters _ or -.`;
export const EMAIL_FEEDBACK = 'Please enter a valid email address.';
