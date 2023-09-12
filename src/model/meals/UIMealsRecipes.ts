export interface UIMealRecipe {
  userId: string;
  recipeId: string;
  name: string;
  ingredients: UIMealRecipeIngredient[];
  servingSize: string;
  preparation: string;
  notes: string;
  preparationTime: number;
  favorite: boolean;
  created: number;
  lastModified: number;
}

export interface UIMealRecipes {
  recipes: UIMealRecipe[];
}

export interface UIMealIngredient {
  value: string;
  quantities?: string[];
  variations?: string[];
}

export interface UIMealIngredients {
  ingredients: UIMealIngredient[];
}

export interface UIMealRecipeIngredient {
  ingredient: string;
  variation?: string;
  quantity: number;
  quantityUnit: string;
}
