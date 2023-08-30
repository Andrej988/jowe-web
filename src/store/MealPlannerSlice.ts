import { createSlice } from '@reduxjs/toolkit';
import { UIListValues } from 'src/model/masterdata/UIListValues';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';

export interface MealPlannerState {
  recipes: UIMealRecipe[];
  ingredients: UIListValues[];
  isFetchedMealRecipes: boolean;
  isFetchedMealIngredients: boolean;
}

const initialState: MealPlannerState = {
  recipes: [],
  ingredients: [],
  isFetchedMealRecipes: false,
  isFetchedMealIngredients: false,
};

const addRecipe = (state: MealPlannerState, recipe: UIMealRecipe): void => {
  const newRecipes = [...state.recipes];
  newRecipes.push(recipe);
  state.recipes = newRecipes;
};

const updateRecipe = (state: MealPlannerState, recipe: UIMealRecipe): void => {
  const newRecipes = [...state.recipes].filter((x) => x.recipeId !== recipe.recipeId);
  newRecipes.push(recipe);
  state.recipes = newRecipes;
};

const removeRecipe = (state: MealPlannerState, recipeId: string): void => {
  const newRecipes = [...state.recipes];
  state.recipes = newRecipes.filter((x) => x.recipeId !== recipeId);
};

const MealPlannerSlice = createSlice({
  name: 'mealPlanner',
  initialState,
  reducers: {
    setRecipes(state, action) {
      state.recipes = action.payload;
      state.isFetchedMealRecipes = true;
    },
    setIngredients(state, action) {
      state.ingredients = action.payload;
      state.isFetchedMealIngredients = true;
    },
    addRecipe(state, action) {
      addRecipe(state, action.payload);
    },
    updateRecipe(state, action) {
      updateRecipe(state, action.payload);
    },
    removeRecipe(state, action) {
      removeRecipe(state, action.payload);
    },
    resetState(state) {
      state.recipes = [];
      state.ingredients = [];
      state.isFetchedMealRecipes = false;
      state.isFetchedMealIngredients = false;
    },
  },
});

export const actions = MealPlannerSlice.actions;
export default MealPlannerSlice.reducer;
