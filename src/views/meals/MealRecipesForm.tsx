import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MealRecipes from 'src/components/meals/MealRecipes';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';
import MealRecipesService from 'src/services/meal/MealRecipesService';

import { ReduxStoreState } from 'src/store/Store';

const MealRecipesForm: React.FC = () => {
  const [recipes, setRecipes] = useState<UIMealRecipe[]>([]);
  const isFetchedRecipes: boolean = useSelector(
    (state: ReduxStoreState) => state.mealPlanner.isFetchedMealRecipes,
  );
  const isFetchedIngredients: boolean = useSelector(
    (state: ReduxStoreState) => state.mealPlanner.isFetchedMealIngredients,
  );
  const recipesState = useSelector((state: ReduxStoreState) => state.mealPlanner.recipes);

  useEffect(() => {
    setRecipes(
      recipesState.slice().sort((a: UIMealRecipe, b: UIMealRecipe) => a.name.localeCompare(b.name)),
    );
  }, [recipesState]);

  useEffect(() => {
    if (!isFetchedRecipes) {
      MealRecipesService.getInstance()
        .retrieveRecipes()
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isFetchedRecipes]);

  useEffect(() => {
    if (!isFetchedIngredients) {
      MealRecipesService.getInstance()
        .retrieveIngredients()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isFetchedIngredients]);

  return (
    <Fragment>
      <MealRecipes
        title="Recipes"
        items={recipes.slice()}
        showDetailsButton={true}
        showEditButton={true}
        showDeleteButton={true}
      />
    </Fragment>
  );
};

export default MealRecipesForm;
