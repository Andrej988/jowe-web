export interface MealRecipeIngredientDto {
  name: string;
}

export interface MealRecipeRequestDto {
  name: string;
  ingredients: MealRecipeIngredientDto[];
  preparation: string;
  preparationTime: number;
}

export interface MealRecipeWithIdRequestDto extends MealRecipeRequestDto {
  recipeId: string;
}

export interface AddMealRecipeRequestDto {
  recipe: MealRecipeRequestDto;
}

export interface EditMealRecipeRequestDto {
  recipe: MealRecipeWithIdRequestDto;
}

export interface MealRecipeResponseDto {
  userId: string;
  recipeId: string;
  name: string;
  ingredients: MealRecipeIngredientDto[];
  preparation: string;
  preparationTime: number;
  created: number;
  lastModified: number;
}

export interface MealRecipesResponseDto {
  reipes: MealRecipeResponseDto[];
}

export const buildAddMealRecipeRequestDto = (
  name: string,
  ingredients: string[],
  preparation: string,
  preparationTime: number,
): AddMealRecipeRequestDto => {
  return {
    recipe: {
      name,
      preparation,
      preparationTime,
      ingredients: ingredients.map((x) => {
        return { name: x };
      }),
    },
  };
};

export const buildEditMealRecipeRequestDto = (
  recipeId: string,
  name: string,
  ingredients: string[],
  preparation: string,
  preparationTime: number,
): EditMealRecipeRequestDto => {
  return {
    recipe: {
      recipeId,
      name,
      preparation,
      preparationTime,
      ingredients: ingredients.map((x) => {
        return { name: x };
      }),
    },
  };
};
