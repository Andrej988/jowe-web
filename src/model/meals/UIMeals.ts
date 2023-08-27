export interface UIMealRecipeIngredient {
  name: string;
}

export interface UIMealRecipe {
  userId: string;
  recipeId: string;
  name: string;
  ingredients: UIMealRecipeIngredient[];
  preparation: string;
  preparationTime: number;
  created: number;
  lastModified: number;
}
