export class AddMeasurementError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'AddMeasurementError';
    this.stack = stack;
  }
}

export class DeleteMeasurementError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'DeleteMeasurementError';
    this.stack = stack;
  }
}
