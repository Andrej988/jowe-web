export class AddRecipeError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'AddRecipeError';
    this.stack = stack;
  }
}

export class EditRecipeError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'EditRecipeError';
    this.stack = stack;
  }
}

export class DeleteRecipeError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'DeleteRecipeError';
    this.stack = stack;
  }
}

export class RecipesRetrievalError extends Error {
  constructor(message: string, stack: string | undefined = undefined) {
    super(message);
    this.name = 'RecipesRetrievalError';
    this.stack = stack;
  }
}
