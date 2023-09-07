import { ListValuesDto } from '../masterdata/ListValuesDto';
import { MealRecipeResponseDto } from './MealRecipeDtos';
import { UIMealIngredients, UIMealRecipe, UIMealRecipes } from './UIMealsRecipes';

export const buildRecipeFromResponseDto = (dto: MealRecipeResponseDto): UIMealRecipe => {
  return {
    userId: dto.userId,
    recipeId: dto.recipeId,
    name: dto.name,
    ingredients: JSON.parse(dto.ingredients),
    preparation: dto.preparation,
    preparationTime: dto.preparationTime,
    favorite: dto.favorite,
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

export const mapListValuesToUIMealIngredients = (dto: ListValuesDto): UIMealIngredients => {
  return {
    ingredients: dto.values.map((x) => {
      return {
        value: x.value,
        quantities: x.stringSet1,
        variations: x.stringSet2,
      };
    }),
  };
};
