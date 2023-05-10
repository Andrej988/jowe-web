export class AddTargetWeightError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'AddTargetWeightError';
    this.stack = stack;
  }
}

export class DeleteTargetWeightError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'DeleteTargetWeightError';
    this.stack = stack;
  }
}

export class TargetWeightRetrievalError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'TargetWeightRetrievalError';
    this.stack = stack;
  }
}
