import { MealRecipeResponseDto } from './MealRecipeDtos';
import { UIMealRecipe, UIMealRecipes } from './UIMealsRecipes';

export const buildRecipeFromResponseDto = (dto: MealRecipeResponseDto): UIMealRecipe => {
  return {
    userId: dto.userId,
    recipeId: dto.recipeId,
    name: dto.name,
    ingredients: dto.ingredients,
    preparation: dto.preparation,
    preparationTime: dto.preparationTime,
    created: dto.created,
    lastModified: dto.lastModified,
  };
};

export const buildRecipesFromResponseDto = (dto: MealRecipeResponseDto[]): UIMealRecipes => {
  const recipes: UIMealRecipes = {
    recipes: [],
  };

  if (dto.length > 0) {
    dto.forEach((item) => {
      recipes.recipes.push(buildRecipeFromResponseDto(item));
    });
  }

  return recipes;
};
