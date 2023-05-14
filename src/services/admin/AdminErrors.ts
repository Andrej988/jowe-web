export class DeleteUserDataError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'DeleteUserDataError';
    this.stack = stack;
  }
}
