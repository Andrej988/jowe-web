export class ListValuesRetrievalError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'ListValuesRetrievalError';
    this.stack = stack;
  }
}
