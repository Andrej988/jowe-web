import {
  AT_LEAST_ONE_NUMBER_REGEX,
  AT_LEAST_ONE_LOWERCASE_CHAR_REGEX,
  AT_LEAST_ONE_UPPERCASE_CHAR_REGEX,
  AT_LEAST_ONE_SPECIAL_CHAR_REGEX,
} from 'src/services/utils/Regex';
import { isAtLeastXCharsLong } from 'src/services/utils/Validators';

export enum PasswordPolicyDetail {
  AT_LEAST_1_NUMBER = 'at least one number',
  AT_LEAST_1_UPPERCASE_CHAR = 'at least one uppercase letter',
  AT_LEAST_1_LOWERCASE_CHAR = 'at least one lowercase letter',
  AT_LEAST_1_SPECIAL_CHARACTER = 'at least one special character (!, @, #, $, %, ^, &, *, =, +, or -)',
}

export interface PasswordValidationResult {
  result: boolean;
  notEnoughChars: boolean;
  // details: Record<PasswordPolicyDetail, boolean>;
  detailValid: Map<PasswordPolicyDetail, boolean>;
}

export class PasswordPolicy {
  constructor(
    private readonly minNumOfChars: number,
    private readonly details: PasswordPolicyDetail[],
  ) {}

  public get minNumberOfChars(): number {
    return this.minNumOfChars;
  }

  public get policyDetails(): PasswordPolicyDetail[] {
    return this.details;
  }

  isPasswordAccordingToPolicy(password: string): PasswordValidationResult {
    const validationResult: PasswordValidationResult = {
      result: true,
      notEnoughChars: false,
      detailValid: new Map(),
    };

    if (!isAtLeastXCharsLong(password, this.minNumOfChars)) {
      validationResult.result = false;
      validationResult.notEnoughChars = true;
    }

    for (const policyDetail of this.details) {
      const isValid = this.validatePasswordPolicyDetail(password, policyDetail);
      validationResult.detailValid.set(policyDetail, isValid);
      if (!isValid) {
        validationResult.result = false;
      }
    }
    return validationResult;
  }

  private validatePasswordPolicyDetail(value: string, policyDetail: PasswordPolicyDetail): boolean {
    switch (policyDetail) {
      case PasswordPolicyDetail.AT_LEAST_1_NUMBER:
        return AT_LEAST_ONE_NUMBER_REGEX.test(value);
      case PasswordPolicyDetail.AT_LEAST_1_LOWERCASE_CHAR:
        return AT_LEAST_ONE_LOWERCASE_CHAR_REGEX.test(value);
      case PasswordPolicyDetail.AT_LEAST_1_UPPERCASE_CHAR:
        return AT_LEAST_ONE_UPPERCASE_CHAR_REGEX.test(value);
      case PasswordPolicyDetail.AT_LEAST_1_SPECIAL_CHARACTER:
        return AT_LEAST_ONE_SPECIAL_CHAR_REGEX.test(value);
      default:
        throw new Error('Password Policy is not implemented!');
    }
  }
}
