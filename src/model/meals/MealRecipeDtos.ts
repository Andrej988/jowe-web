import { jsonEscape } from 'src/services/utils/Json';
import { UIMealRecipeIngredient } from './UIMealsRecipes';

export interface MealRecipeIngredientDto {
  name: string;
}

export interface MealRecipeRequestDto {
  name: string;
  ingredients: string;
  servingSize: string;
  preparation: string;
  notes: string;
  preparationTime: number;
  favorite: boolean;
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
  servingSize: string;
  preparation: string;
  notes: string;
  preparationTime: number;
  favorite: boolean;
  created: number;
  lastModified: number;
}

export interface MealRecipesResponseDto {
  reipes: MealRecipeResponseDto[];
}

export const buildAddMealRecipeRequestDto = (
  name: string,
  ingredients: UIMealRecipeIngredient[],
  servingSize: string,
  preparation: string,
  notes: string,
  preparationTime: number,
  favorite: boolean,
): AddMealRecipeRequestDto => {
  return {
    recipe: {
      name,
      ingredients: JSON.stringify(ingredients),
      servingSize,
      preparation: jsonEscape(preparation),
      notes: jsonEscape(notes),
      preparationTime,
      favorite,
    },
  };
};

export const buildEditMealRecipeRequestDto = (
  recipeId: string,
  name: string,
  ingredients: UIMealRecipeIngredient[],
  servingSize: string,
  preparation: string,
  notes: string,
  preparationTime: number,
  favorite: boolean,
): EditMealRecipeRequestDto => {
  return {
    recipe: {
      recipeId,
      name,
      ingredients: JSON.stringify(ingredients),
      servingSize,
      preparation: jsonEscape(preparation),
      notes: jsonEscape(notes),
      preparationTime,
      favorite,
    },
  };
};
