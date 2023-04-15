export class UserNotConfirmedError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'UserNotConfirmedError';
    this.stack = stack;
  }
}
