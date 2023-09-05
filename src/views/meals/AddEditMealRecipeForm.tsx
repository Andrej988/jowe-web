import React, {
  type ChangeEvent,
  type PropsWithChildren,
  useState,
  useEffect,
  type FormEvent,
  Fragment,
} from 'react';
import { CButton, CCol, CForm, CRow } from '@coreui/react';
import Modal from 'src/components/utils/Modal';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { cilBasket, cilClock, cilFastfood, cilNotes, cilPencil, cilWarning } from '@coreui/icons';
import { isMoreThan, isLessThanOrEquals, isNotEmpty } from 'src/services/utils/Validators';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStoreState, ToastMsg, toasterActions } from 'src/store/Store';
import { UIMealRecipe, UIMealRecipeIngredient } from 'src/model/meals/UIMealsRecipes';
import {
  AddMealRecipeRequestDto,
  EditMealRecipeRequestDto,
  buildAddMealRecipeRequestDto,
  buildEditMealRecipeRequestDto,
} from 'src/model/meals/MealRecipeDtos';
import FormTextAreaWithFeedback from 'src/components/utils/FormTextAreaWithFeedback';
import MealRecipesService from 'src/services/meal/MealRecipesService';
import { jsonRemoveEscape } from 'src/services/utils/Json';
import FormSelectGroupWithFeedbackEnhanced, {
  ListOption,
} from 'src/components/utils/FormSelectGroupWithFeedbackEnhanced';

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

const NAME_FEEDBACK = 'Please enter meal recipe name.';

const DEFAULT_PREPARATION_TIME_VALUE = 60;
const MAX_PREPARATION_TIME = 720;

enum IngredientsSubset {
  Variations,
  Quantities,
}

enum FormState {
  Step1_BaseData = 1,
  Step2_Ingredients = 2,
  Step3_Preparation = 3,
}

const isNameValid = (name: string): boolean => {
  return isNotEmpty(name);
};

const printMealRecipeIngredient = (ingredient: UIMealRecipeIngredient): string => {
  let printout = ingredient.ingredient;
  if (ingredient.variation) {
    printout += ' (' + ingredient.variation + ')';
  }
  printout += `: ${ingredient.quantity} ${ingredient.quantityUnit}`;
  return printout;
};

const AddEditMealRecipeForm: React.FC<Props> = (props) => {
  const [formState, setFormState] = useState<FormState>(FormState.Step1_BaseData);
  const [isValidated, setIsValidated] = useState<boolean>(DEFAULT_IS_VALIDATED);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(false);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

  const [title, setTitle] = useState(TITLE_ADD);
  const [recipeId, setRecipeId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [preparation, setPreparation] = useState<string>('');
  const [preparationTime, setPreparationTime] = useState<number>(DEFAULT_PREPARATION_TIME_VALUE);
  const [favorite, setFavorite] = useState<boolean>(false);
  const dispatch = useDispatch();
  const ingredientsListValues = useSelector(
    (state: ReduxStoreState) => state.mealPlanner.ingredients,
  );

  const [selectedIngredient, setSelectedIngredient] = useState<ListOption | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ListOption | null>(null);
  const [selectedQuantityUnit, setSelectedQuantityUnit] = useState<ListOption | null>(null);
  const [ingredientQuantity, setIngredientQuantity] = useState<number>(0);
  const [ingredients, setIngredients] = useState<UIMealRecipeIngredient[]>([]);

  const onNameInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const onPreparationInputChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setPreparation(event.target.value);
  };

  const onPreparationTimeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPreparationTime(Number(event.target.value));
  };

  const onSelectedIngredientChange = (option: ListOption | null) => {
    setSelectedIngredient(option);
    setSelectedVariation(null);
    setSelectedQuantityUnit(null);
  };

  const onSelectedVariationChange = (option: ListOption | null) => {
    setSelectedVariation(option);
  };

  const onSelectedQuantityUnitChange = (option: ListOption | null) => {
    setSelectedQuantityUnit(option);
  };

  const onIngredientQuantityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIngredientQuantity(Number(event.target.value));
  };

  const getSelectedIngredientOptions = (dataSubset: IngredientsSubset): ListOption[] =>
    ingredientsListValues
      .filter((x) => x.value === selectedIngredient?.value)
      .filter((x) => (dataSubset === IngredientsSubset.Variations ? x.variations : x.quantities))
      .flatMap((x) => (dataSubset === IngredientsSubset.Variations ? x.variations : x.quantities))
      .map((x) => {
        return {
          value: x ? x : 'N/A',
          label: x ? x : 'N/A',
        };
      });

  const validateFormStep = (): boolean => {
    let nameValid = false;
    let ingredientsValid = false;
    let preparationValid = false;
    let preparationTimeValid = false;

    switch (formState) {
      case FormState.Step1_BaseData: {
        nameValid = isNameValid(name);
        ingredientsValid = true;
        preparationValid = true;
        preparationTimeValid = true;
        setIsValidated(true);
        break;
      }
      case FormState.Step2_Ingredients: {
        //TODO:
        nameValid = isNameValid(name);
        //ingredientsValid = isNotEmpty(ingredients);
        preparationValid = true;
        preparationTimeValid = true;
        break;
      }
      case FormState.Step3_Preparation: {
        nameValid = isNameValid(name);
        //TODO INGREDIENTS VALIDATION
        //ingredientsValid = isNotEmpty(ingredients);
        preparationValid = isNotEmpty(preparation);
        preparationTimeValid =
          isMoreThan(preparationTime, 0) &&
          isLessThanOrEquals(preparationTime, MAX_PREPARATION_TIME);
        break;
      }
      default: {
        break;
      }
    }

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
      //TODO:
      //setIngredients(jsonRemoveEscape(props.existingItem.ingredients));
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
        validateFormStep();
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
        setIsSaveButtonDisabled(false);
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
        setIsSaveButtonDisabled(false);
      });
  };

  const onAddItemHandler = (): void => {
    const isFormValid = validateFormStep();
    const prepTime: number = preparationTime ? preparationTime : 0;

    if (isFormValid) {
      setIsSaveButtonDisabled(true);
      //TODO: ingredients is currently dummy string
      if (!props.existingItem) {
        addItem(buildAddMealRecipeRequestDto(name, 'DUMMY', preparation, prepTime, favorite));
      } else {
        editItem(
          buildEditMealRecipeRequestDto(recipeId, name, 'DUMMY', preparation, prepTime, favorite),
        );
      }
    }
  };

  const clearForm = (): void => {
    setFormState(FormState.Step1_BaseData);
    setIsValidated(DEFAULT_IS_VALIDATED);
    setRecipeId('');
    setName('');
    setIngredients([]);
    setPreparation('');
    setPreparationTime(DEFAULT_PREPARATION_TIME_VALUE);
    setFavorite(false);
    setFormValidityState(DEFAULT_FORM_VALIDITY_STATE);
    setIsSaveButtonDisabled(false);
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

  const onBackHandler = (): void => {
    if (formState > FormState.Step1_BaseData) {
      setFormState(formState - 1);
    } else {
      onCloseFormHandler();
    }
  };

  const onNextHandler = (): void => {
    if (formState < FormState.Step3_Preparation) {
      const isValid = validateFormStep();
      if (isValid) {
        setFormState(formState + 1);
      }
    } else {
      onAddItemHandler();
    }
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onNextHandler();
  };

  const onAddIngredientHandler = (): void => {
    if (selectedIngredient && selectedQuantityUnit) {
      const ingredientToAdd: UIMealRecipeIngredient = {
        ingredient: selectedIngredient?.value,
        variation: selectedVariation?.value,
        quantity: ingredientQuantity,
        quantityUnit: selectedQuantityUnit?.value,
      };

      const currentIngredients = ingredients
        .slice()
        .filter(
          (x) =>
            x.ingredient !== ingredientToAdd.ingredient ||
            x.variation !== ingredientToAdd.variation,
        );
      currentIngredients.push(ingredientToAdd);
      setIngredients(currentIngredients);
    }
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      size="lg"
      primaryButtonText={formState === FormState.Step1_BaseData ? 'Close' : 'Back'}
      primaryButtonHandler={onBackHandler}
      primaryButtonColor="danger"
      showSecondaryButton={true}
      secondaryButtonText={formState === FormState.Step3_Preparation ? 'Submit' : 'Next'}
      secondaryButtonHandler={onNextHandler}
      secondaryButtonDisabled={formState === FormState.Step3_Preparation && isSaveButtonDisabled}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm onSubmit={onSubmitHandler}>
        <CRow>
          <CCol sm={12}>
            <FormInputGroupWithFeedback
              id="name"
              icon={cilPencil}
              type="text"
              label="Recipe Name"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="name"
              value={name}
              onChange={onNameInputChangeHandler}
              invalid={isValidated && !formValidtyState.nameValid}
              disabled={formState !== FormState.Step1_BaseData}
              feedbackMsg={NAME_FEEDBACK}
            />
          </CCol>
        </CRow>
        {formState === FormState.Step2_Ingredients && (
          <Fragment>
            <CRow className="mt-4">
              <CCol sm={12}>
                <hr />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={6}>
                <FormSelectGroupWithFeedbackEnhanced
                  icon={cilBasket}
                  id="ingredients-select"
                  label="Ingredient"
                  value={selectedIngredient}
                  onChange={onSelectedIngredientChange}
                  placeholder="Select ingredient..."
                  options={ingredientsListValues.map((x) => {
                    return {
                      value: x.value,
                      label: x.value.charAt(0).toUpperCase() + x.value.slice(1),
                    };
                  })}
                  feedbackMsg="Please select ingredient..."
                />
              </CCol>
              <CCol sm={6}>
                <FormSelectGroupWithFeedbackEnhanced
                  icon={cilBasket}
                  id="variations-select"
                  label="Variation"
                  value={selectedVariation}
                  onChange={onSelectedVariationChange}
                  placeholder={
                    getSelectedIngredientOptions(IngredientsSubset.Variations).length > 0
                      ? 'Select variation...'
                      : 'Variations not available'
                  }
                  options={getSelectedIngredientOptions(IngredientsSubset.Variations)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={6}>
                <FormInputGroupWithFeedback
                  className="mt-2"
                  id="quantity"
                  icon={cilClock}
                  type="number"
                  label="Amount"
                  normalLabel={USE_NORMAL_LABELS}
                  autoComplete="amount"
                  pattern="[0-9]*"
                  value={ingredientQuantity}
                  onChange={onIngredientQuantityChange}
                />
              </CCol>
              <CCol sm={6}>
                <FormSelectGroupWithFeedbackEnhanced
                  icon={cilBasket}
                  id="quantities-select"
                  label="Unit of Measurement"
                  value={selectedQuantityUnit}
                  onChange={onSelectedQuantityUnitChange}
                  placeholder={
                    getSelectedIngredientOptions(IngredientsSubset.Quantities).length > 0
                      ? 'Select quantity...'
                      : 'Quantities not available'
                  }
                  className="mt-2"
                  options={getSelectedIngredientOptions(IngredientsSubset.Quantities)}
                />
              </CCol>
            </CRow>
            <CRow className="mt-2 justify-content-end">
              <CCol sm={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CButton variant="outline" color="secondary" onClick={onAddIngredientHandler}>
                  Add ingredient
                </CButton>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={12}>
                <hr />
                List of Ingredients:
                {ingredients.length > 0 && (
                  <ul>
                    {ingredients.map((x, index) => (
                      <li key={index}>{printMealRecipeIngredient(x)}</li>
                    ))}
                  </ul>
                )}
              </CCol>
            </CRow>
          </Fragment>
        )}
        {formState === FormState.Step3_Preparation && (
          <Fragment>
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
              <CCol sm={4}>
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
          </Fragment>
        )}
      </CForm>
    </Modal>
  );
};

export default AddEditMealRecipeForm;
