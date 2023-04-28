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
