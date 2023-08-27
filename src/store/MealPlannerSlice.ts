import { createSlice } from '@reduxjs/toolkit';
import { UIMealRecipe } from 'src/model/meals/UIMeals';

export interface MealPlannerState {
  recipes: UIMealRecipe[];
  isFetchedMealRecipes: boolean;
}

const initialState: MealPlannerState = {
  recipes: [],
  isFetchedMealRecipes: false,
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
      state.isFetchedMealRecipes = false;
    },
  },
});

export const actions = MealPlannerSlice.actions;
export default MealPlannerSlice.reducer;
