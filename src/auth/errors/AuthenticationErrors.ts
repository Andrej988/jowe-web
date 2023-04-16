export class RegistrationError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'RegistrationError';
    this.stack = stack;
  }
}

export class AccountConfirmationError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'AccountConfirmationError';
    this.stack = stack;
  }
}

export class AuthenticationError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'AuthenticationError';
    this.stack = stack;
  }
}

export class UserNotAuthenticatedError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'UserNotAuthenticatedError';
    this.stack = stack;
  }
}

export class UserNotConfirmedError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'UserNotConfirmedError';
    this.stack = stack;
  }
}

export class LogoutError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'LogoutError';
    this.stack = stack;
  }
}

export class UserDeletionError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'UserDeletionError';
    this.stack = stack;
  }
}

export class TokenRefreshError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'TokenRefreshError';
    this.stack = stack;
  }
}

export class UserSessionExpiredError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'UserSessionExpiredError';
    this.stack = stack;
  }
}

export class ForgotPasswordFlowException extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'ForgotPasswordFlowException';
    this.stack = stack;
  }
}

export class ChangePasswordError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'ChangePasswordError';
    this.stack = stack;
  }
}
