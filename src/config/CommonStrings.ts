import {
  NAME_MAX_LENGTH,
  PASSWORD_POLICY,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from './ServiceConfig';

export const CONFIRMATION_CODE_FEEDBACK =
  'Please enter a valid verification code received via email.';

export const CURRENT_PASSWORD_MISSING = `Current password should be provided and must be at least ${PASSWORD_POLICY.minNumberOfChars} characters long.`;
export const PASSWORD_CONFIRMATION_FEEDBACK = 'Passwords do not match.';

export const NAME_FEEDBACK = `Name is mandatory and should not exceed ${NAME_MAX_LENGTH} characters.`;
export const USERNAME_FEEDBACK = `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters long and must contain only letters, numbers, or the special characters _ or -.`;
export const EMAIL_FEEDBACK = 'Please enter a valid email address.';

export const DATE_GENERIC_FEEDBACK = 'Please select a date.';
export const STRICT_PERCENTAGE_VALUE_FEEDBACK = 'Value should be in percentage (0-100).';

export const WEIGHT_FEEDBACK = 'Weight should be a positve number.';
