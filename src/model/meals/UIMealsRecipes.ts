export interface UIMealRecipe {
  userId: string;
  recipeId: string;
  name: string;
  ingredients: string;
  preparation: string;
  preparationTime: number;
  created: number;
  lastModified: number;
}

export interface UIMealRecipes {
  recipes: UIMealRecipe[];
}
