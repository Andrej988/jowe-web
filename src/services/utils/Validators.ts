import {
  AWS_CONFIRMATION_CODE_MAX_LENGTH,
  AWS_CONFIRMATION_CODE_MIN_LENGTH,
  PASSWORD_POLICY,
} from 'src/config/ServiceConfig';
import { EMAIL_REGEX } from './Regex';
import { type PasswordValidationResult } from '../auth/PasswordPolicy';

export const isNotEmpty = (value: string): boolean => {
  return value.trim() !== '';
};

export const isEmpty = (value: string): boolean => {
  return !isNotEmpty(value);
};

export const isNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num);
};

export const isMoreThan = (value: number, boundary: number): boolean => {
  return value > boundary;
};

export const isMoreThanOrEquals = (value: number, boundary: number): boolean => {
  return value === boundary || isMoreThan(value, boundary);
};

export const isLessThan = (value: number, boundary: number): boolean => {
  return value < boundary;
};

export const isLessThanOrEquals = (value: number, boundary: number): boolean => {
  return value === boundary || isLessThan(value, boundary);
};

export const isValidDateString = (value: string): boolean => {
  return !isNaN(Date.parse(value));
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

export const isPasswordAccordingToPolicy = (password: string): PasswordValidationResult => {
  return PASSWORD_POLICY.isPasswordAccordingToPolicy(password);
};

export const isValidPercentage = (value: number | undefined, optionalValue?: boolean): boolean => {
  return (
    (optionalValue === true && value === undefined) ||
    (value !== undefined && value >= 0 && value <= 100)
  );
};

export const isValidPercentageString = (
  value: string | undefined,
  optionalValue?: boolean,
): boolean => {
  if (value === undefined || isEmpty(value)) {
    if (optionalValue === true) {
      return true;
    } else {
      return false;
    }
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return false;
  } else {
    return isValidPercentage(num, optionalValue);
  }
};
