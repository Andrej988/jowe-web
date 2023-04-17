import {
  AWS_CONFIRMATION_CODE_MAX_LENGTH,
  AWS_CONFIRMATION_CODE_MIN_LENGTH,
  PASSWORD_POLICY,
} from 'src/config/ServiceConfig';
import {
  AT_LEAST_ONE_LOWERCASE_CHAR_REGEX,
  AT_LEAST_ONE_NUMBER_REGEX,
  AT_LEAST_ONE_SPECIAL_CHAR_REGEX,
  AT_LEAST_ONE_UPPERCASE_CHAR_REGEX,
  EMAIL_REGEX,
} from './Regex';
import { PasswordPolicy } from 'src/config/PasswordPolicy';

export const isNotEmpty = (value: string): boolean => {
  return value.trim() !== '';
};

export const isAtLeastXCharsLong = (value: string, numOfChars: number): boolean => {
  return value.trim().length >= numOfChars;
};

export const isNotLongerThanXChars = (value: string, numOfChars: number): boolean => {
  return value.trim().length <= numOfChars;
};

export const isCorrectLength = (value: string, minChars: number, maxChars: number): boolean => {
  return isAtLeastXCharsLong(value, minChars) && isNotLongerThanXChars(value, maxChars);
};

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const isValidConfirmationCodeLength = (confirmationCode: string): boolean => {
  return isCorrectLength(
    confirmationCode,
    AWS_CONFIRMATION_CODE_MIN_LENGTH,
    AWS_CONFIRMATION_CODE_MAX_LENGTH,
  );
};

export const isPasswordAccordingToPolicy = (value: string): boolean => {
  if (!isNotEmpty(value)) {
    return false;
  }

  for (const policy of PASSWORD_POLICY) {
    const isValid = validateByPasswordPolicy(value, policy);
    if (!isValid) {
      return false;
    }
  }
  return true;
};

const validateByPasswordPolicy = (value: string, policy: PasswordPolicy): boolean => {
  switch (policy) {
    case PasswordPolicy.AT_LEAST_8_CHARS:
      return isAtLeastXCharsLong(value, 8);
    case PasswordPolicy.AT_LEAST_1_NUMBER:
      return AT_LEAST_ONE_NUMBER_REGEX.test(value);
    case PasswordPolicy.AT_LEAST_1_LOWERCASE_CHAR:
      return AT_LEAST_ONE_LOWERCASE_CHAR_REGEX.test(value);
    case PasswordPolicy.AT_LEAST_1_UPPERCASE_CHAR:
      return AT_LEAST_ONE_UPPERCASE_CHAR_REGEX.test(value);
    case PasswordPolicy.AT_LEAST_1_SPECIAL_CHARACTER:
      return AT_LEAST_ONE_SPECIAL_CHAR_REGEX.test(value);
    default:
      throw new Error('Password Policy is not implemented!');
  }
};
