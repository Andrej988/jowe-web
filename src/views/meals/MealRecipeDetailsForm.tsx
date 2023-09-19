import React from 'react';
import type { PropsWithChildren } from 'react';
import Modal from 'src/components/utils/Modal';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';
import MealRecipesService from 'src/services/meal/MealRecipesService';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  item: UIMealRecipe | undefined;
}

const MealRecipeDetailsForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Recipe Overview"
      visible={props.visible}
      primaryButtonText="Close"
      primaryButtonHandler={props.onCloseHandler}
      showSecondaryButton={false}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <div>
        <p>
          <b>Recipe ID:</b> {props.item?.recipeId}
          <br />
        </p>
        <p>
          <b>Name:</b> {props.item?.name}
        </p>
        <p>
          <b>Preparation time:</b> {props.item?.preparationTime} min(s)
        </p>
        <p>
          <b>Serving size:</b> {props.item?.servingSize ? props.item?.servingSize : '/'}
        </p>
        <b>Ingredients:</b> <br />
        <ul>
          {props.item?.ingredients.map((x, index) => (
            <li key={index}>
              <label key={index}>
                {MealRecipesService.getInstance().printMealRecipeIngredient(x)}
              </label>
            </li>
          ))}
        </ul>
        <b>Preparation:</b>
        <p style={{ whiteSpace: 'pre-line' }}>{props.item?.preparation}</p>
        <b>Notes:</b>
        <p style={{ whiteSpace: 'pre-line' }}>{props.item?.notes ? props.item?.notes : '/'}</p>
      </div>
    </Modal>
  );
};

export default MealRecipeDetailsForm;
