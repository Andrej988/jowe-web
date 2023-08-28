import { cilBalanceScale, cilTrash, cilWarning } from '@coreui/icons';
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/utils/Modal';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';
import MealRecipesService from 'src/services/meal/MealRecipesService';
import { ToastMsg, toasterActions } from 'src/store/Store';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onDeleteHandler: () => void;
  recipe: UIMealRecipe | undefined;
}

const TOAST_TITLE_DELETE_DEFAULT = 'Delete Recipe';
const TOAST_TITLE_DELETE_ERROR = 'Delete Recipe Error';
const TOAST_MESSAGE_DELETE_SUCCESSFUL = 'Recipe was deleted successfully.';

const DeleteMealRecipeForm: React.FC<Props> = (props) => {
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onDeleteRecipeHandler = (): void => {
    if (props.recipe?.recipeId !== undefined) {
      setIsDeleteButtonDisabled(true);
      MealRecipesService.getInstance()
        .deleteRecipe(props.recipe?.recipeId)
        .then(() => {
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(
                cilBalanceScale,
                TOAST_TITLE_DELETE_DEFAULT,
                TOAST_MESSAGE_DELETE_SUCCESSFUL,
              ),
            ),
          );
          setIsDeleteButtonDisabled(false);
          props.onDeleteHandler();
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_DELETE_ERROR, err.message),
            ),
          );
          setIsDeleteButtonDisabled(false);
        });
    }
  };

  return (
    <Modal
      title="Delete a Recipe"
      visible={props.visible}
      primaryButtonIcon={cilTrash}
      primaryButtonColor="danger"
      primaryButtonText="Delete"
      primaryButtonHandler={onDeleteRecipeHandler}
      primaryButtonDisabled={isDeleteButtonDisabled}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <div>
        <p>Are you sure you want to delete the following recipe?</p>
        <p>
          Measurement ID: {props.recipe?.recipeId}
          <br />
          Name: {props.recipe?.name}
        </p>
      </div>
    </Modal>
  );
};

export default DeleteMealRecipeForm;
