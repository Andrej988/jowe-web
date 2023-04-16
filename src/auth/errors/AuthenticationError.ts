export class AuthenticationError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'AuthenticationError';
    this.stack = stack;
  }
}
