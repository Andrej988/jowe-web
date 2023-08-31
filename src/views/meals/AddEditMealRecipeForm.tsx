import React, {
  type ChangeEvent,
  type PropsWithChildren,
  useState,
  useEffect,
  type FormEvent,
} from 'react';
import { CCol, CForm, CRow } from '@coreui/react';
import Modal from 'src/components/utils/Modal';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { cilBasket, cilClock, cilFastfood, cilNotes, cilPencil, cilWarning } from '@coreui/icons';
import { isMoreThan, isLessThanOrEquals, isNotEmpty } from 'src/services/utils/Validators';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStoreState, ToastMsg, toasterActions } from 'src/store/Store';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';
import {
  AddMealRecipeRequestDto,
  EditMealRecipeRequestDto,
  buildAddMealRecipeRequestDto,
  buildEditMealRecipeRequestDto,
} from 'src/model/meals/MealRecipeDtos';
import FormTextAreaWithFeedback from 'src/components/utils/FormTextAreaWithFeedback';
import MealRecipesService from 'src/services/meal/MealRecipesService';
import { jsonRemoveEscape } from 'src/services/utils/Json';
import FormSelectGroupWithFeedbackEnhanced from 'src/components/utils/FormSelectGroupWithFeedbackEnhanced';

interface Props extends PropsWithChildren {
  visible: boolean;
  existingItem?: UIMealRecipe;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

interface FormValidityState {
  nameValid: boolean;
  ingredientsValid: boolean;
  preparationValid: boolean;
  preparationTimeValid: boolean;
}

const USE_NORMAL_LABELS = true;
const DEFAULT_IS_VALIDATED = false;
const DEFAULT_FORM_VALIDITY_STATE: FormValidityState = {
  nameValid: false,
  ingredientsValid: false,
  preparationValid: false,
  preparationTimeValid: false,
};

const TITLE_ADD = 'Add Meal Recipe';
const TITLE_EDIT = 'Edit Meal Recipe';
const TOAST_TITLE_ADD_DEFAULT = 'Add Meal Recipe';
const TOAST_TITLE_ADD_ERROR = 'Add Meal Recipe Error';
const TOAST_MESSAGE_ADD_SUCCESSFUL = 'Meal recipe was added successfully.';
const TOAST_TITLE_EDIT_DEFAULT = 'Edit Meal Recipe';
const TOAST_TITLE_EDIT_ERROR = 'Edit Meal Recipe Error';
const TOAST_MESSAGE_EDIT_SUCCESSFUL = 'Meal recipe was updated successfully.';

const DEFAULT_PREPARATION_TIME_VALUE = 60;
const MAX_PREPARATION_TIME = 720;

const AddEditMealRecipeForm: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

  const [title, setTitle] = useState(TITLE_ADD);
  const [recipeId, setRecipeId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ingredients, setIngredients] = useState<string>('');
  const [preparation, setPreparation] = useState<string>('');
  const [preparationTime, setPreparationTime] = useState<number>(DEFAULT_PREPARATION_TIME_VALUE);
  const [favorite, setFavorite] = useState<boolean>(false);
  const dispatch = useDispatch();
  const ingredientsListValues = useSelector(
    (state: ReduxStoreState) => state.mealPlanner.ingredients,
  );

  const onNameInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const onIngredientsInputChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setIngredients(event.target.value);
  };

  const onPreparationInputChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setPreparation(event.target.value);
  };

  const onPreparationTimeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPreparationTime(Number(event.target.value));
  };

  const validateForm = (): boolean => {
    const nameValid = isNotEmpty(name);
    const ingredientsValid = isNotEmpty(ingredients);
    const preparationValid = isNotEmpty(preparation);
    const preparationTimeValid =
      isMoreThan(preparationTime, 0) && isLessThanOrEquals(preparationTime, MAX_PREPARATION_TIME);

    setIsValidated(true);
    setFormValidityState({
      nameValid,
      ingredientsValid,
      preparationValid,
      preparationTimeValid,
    });

    return nameValid && ingredientsValid && preparationValid && preparationTimeValid;
  };

  useEffect(() => {
    if (props.existingItem) {
      setTitle(TITLE_EDIT);
      setRecipeId(props.existingItem.recipeId);
      setName(props.existingItem.name);
      setIngredients(jsonRemoveEscape(props.existingItem.ingredients));
      setPreparation(jsonRemoveEscape(props.existingItem.preparation));
      setPreparationTime(props.existingItem.preparationTime);
      setFavorite(props.existingItem.favorite);
    } else {
      setTitle(TITLE_ADD);
    }
  }, [props.existingItem]);

  useEffect(() => {
    if (isValidated) {
      const timerId = setTimeout(() => {
        validateForm();
      }, 250);

      // Cleanup
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [name, ingredients, preparation, preparationTime, isValidated]);

  const addItem = (dto: AddMealRecipeRequestDto): void => {
    MealRecipesService.getInstance()
      .addRecipe(dto)
      .then(() => {
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilFastfood, TOAST_TITLE_ADD_DEFAULT, TOAST_MESSAGE_ADD_SUCCESSFUL),
          ),
        );
        props.onSaveHandler();
        clearFormWithSlightTimeout();
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          toasterActions.addMessage(new ToastMsg(cilWarning, TOAST_TITLE_ADD_ERROR, err.message)),
        );
        setIsAddButtonDisabled(false);
      });
  };

  const editItem = (dto: EditMealRecipeRequestDto): void => {
    MealRecipesService.getInstance()
      .editRecipe(dto)
      .then(() => {
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilFastfood, TOAST_TITLE_EDIT_DEFAULT, TOAST_MESSAGE_EDIT_SUCCESSFUL),
          ),
        );
        props.onSaveHandler();
        clearFormWithSlightTimeout();
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          toasterActions.addMessage(new ToastMsg(cilWarning, TOAST_TITLE_EDIT_ERROR, err.message)),
        );
        setIsAddButtonDisabled(false);
      });
  };

  const onAddItemHandler = (): void => {
    const isFormValid = validateForm();
    const prepTime: number = preparationTime ? preparationTime : 0;

    if (isFormValid) {
      setIsAddButtonDisabled(true);
      if (!props.existingItem) {
        addItem(buildAddMealRecipeRequestDto(name, ingredients, preparation, prepTime, favorite));
      } else {
        editItem(
          buildEditMealRecipeRequestDto(
            recipeId,
            name,
            ingredients,
            preparation,
            prepTime,
            favorite,
          ),
        );
      }
    }
  };

  const clearForm = (): void => {
    setIsValidated(DEFAULT_IS_VALIDATED);
    setRecipeId('');
    setName('');
    setIngredients('');
    setPreparation('');
    setPreparationTime(DEFAULT_PREPARATION_TIME_VALUE);
    setFavorite(false);
    setFormValidityState(DEFAULT_FORM_VALIDITY_STATE);
    setIsAddButtonDisabled(false);
  };

  const clearFormWithSlightTimeout = (): void => {
    setTimeout(() => {
      clearForm();
    }, 250);
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    clearFormWithSlightTimeout();
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onAddItemHandler();
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      size="lg"
      primaryButtonText="Save Recipe"
      primaryButtonHandler={onAddItemHandler}
      primaryButtonDisabled={isAddButtonDisabled}
      showSecondaryButton={true}
      secondaryButtonColor="danger"
      secondaryButtonText="Close"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm onSubmit={onSubmitHandler}>
        <CRow>
          <CCol sm={12}>
            <FormInputGroupWithFeedback
              id="name"
              icon={cilPencil}
              type="text"
              label="Name"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="name"
              value={name}
              onChange={onNameInputChangeHandler}
              invalid={isValidated && !formValidtyState.nameValid}
              //feedbackMsg={NAME_FEEDBACK}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12}>
            <FormSelectGroupWithFeedbackEnhanced
              icon={cilBasket}
              id="ingredients-select"
              label="Add Ingredient"
              placeholder="Select ingredient..."
              className="mt-2"
              options={ingredientsListValues.map((x) => {
                return {
                  value: x.value,
                  label: x.value.charAt(0).toUpperCase() + x.value.slice(1),
                };
              })}
              feedbackMsg="Please select ingredient..."
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12}>
            <FormTextAreaWithFeedback
              className="mt-2"
              id="ingredients"
              rows={5}
              icon={cilBasket}
              label="Ingredients"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="note"
              value={ingredients}
              onChange={onIngredientsInputChangeHandler}
              invalid={isValidated && !formValidtyState.ingredientsValid}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12}>
            <FormTextAreaWithFeedback
              className="mt-2"
              id="preparation"
              rows={10}
              icon={cilNotes}
              label="Preparation"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="preparation"
              value={preparation}
              onChange={onPreparationInputChangeHandler}
              invalid={isValidated && !formValidtyState.preparationValid}
              //feedbackMsg={PREPARATION_FEEDBACK}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="preparationTime"
              icon={cilClock}
              type="number"
              label="Preparation time in minutes"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="preparation-time"
              pattern="[0-9]*"
              min={1}
              max={MAX_PREPARATION_TIME}
              value={preparationTime}
              maxLength={3}
              onChange={onPreparationTimeInputChangeHandler}
              invalid={isValidated && !formValidtyState.preparationTimeValid}
              //feedbackMsg={STRICT_PERCENTAGE_VALUE_FEEDBACK}
            />
          </CCol>
        </CRow>
      </CForm>
    </Modal>
  );
};

export default AddEditMealRecipeForm;
