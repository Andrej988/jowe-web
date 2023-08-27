import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MealRecipes from 'src/components/meals/MealRecipes';
import { UIMealRecipe } from 'src/model/meals/UIMeals';

import { ReduxStoreState } from 'src/store/Store';

const MealRecipesForm: React.FC = () => {
  const [recipes, setRecipes] = useState<UIMealRecipe[]>([]);
  const isFetched: boolean = useSelector(
    (state: ReduxStoreState) => state.mealPlanner.isFetchedMealRecipes,
  );
  const recipesState = useSelector((state: ReduxStoreState) => state.mealPlanner.recipes);

  useEffect(() => {
    setRecipes(
      recipesState.slice().sort((a: UIMealRecipe, b: UIMealRecipe) => a.name.localeCompare(b.name)),
    );
  }, [recipesState]);

  useEffect(() => {
    if (!isFetched) {
      //TODO: Add service
      /*WeightMeasurementsService.getInstance()
        .retrieveMeasurements()
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });*/
    }
  }, [isFetched]);

  return (
    <Fragment>
      <MealRecipes title="Recipes" items={recipes.slice()} showDeleteButton={true} />
    </Fragment>
  );
};

export default MealRecipesForm;
