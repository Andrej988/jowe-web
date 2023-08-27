import { jsonEscape } from 'src/services/utils/Json';

export interface MealRecipeIngredientDto {
  name: string;
}

export interface MealRecipeRequestDto {
  name: string;
  ingredients: string;
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
  ingredients: string;
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
  ingredients: string,
  preparation: string,
  preparationTime: number,
): AddMealRecipeRequestDto => {
  return {
    recipe: {
      name,
      ingredients: jsonEscape(ingredients),
      preparation: jsonEscape(preparation),
      preparationTime,
    },
  };
};

export const buildEditMealRecipeRequestDto = (
  recipeId: string,
  name: string,
  ingredients: string,
  preparation: string,
  preparationTime: number,
): EditMealRecipeRequestDto => {
  return {
    recipe: {
      recipeId,
      name,
      ingredients: jsonEscape(ingredients),
      preparation: jsonEscape(preparation),
      preparationTime,
    },
  };
};
