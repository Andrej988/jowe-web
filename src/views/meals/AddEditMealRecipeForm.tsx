import React, {
  type ChangeEvent,
  type PropsWithChildren,
  useState,
  useEffect,
  type FormEvent,
  Fragment,
} from 'react';
import { CCol, CForm, CRow } from '@coreui/react';
import Modal from 'src/components/utils/Modal';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { cilClock, cilFastfood, cilNotes, cilPencil, cilWarning } from '@coreui/icons';
import { isMoreThan, isLessThanOrEquals, isNotEmpty } from 'src/services/utils/Validators';
import { useDispatch } from 'react-redux';
import { ToastMsg, toasterActions } from 'src/store/Store';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import FormElementFeedback from 'src/components/utils/FormElementFeedback';
import AddMealRecipeIngredient from 'src/components/meals/AddMealRecipeIngredient';

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

const FEEDBACK_MESSAGES = {
  Name: 'Please enter meal recipe name!',
  Ingredients: 'Please add ingredients!',
};

const DEFAULT_PREPARATION_TIME_VALUE = 60;
const MAX_PREPARATION_TIME = 720;

enum FormState {
  Step1_BaseData = 1,
  Step2_Ingredients = 2,
  Step3_Preparation = 3,
}

const isNameValid = (name: string): boolean => {
  return isNotEmpty(name);
};

const isIngredientsValid = (ingredients: UIMealRecipeIngredient[]): boolean => {
  return ingredients !== null && ingredients.length > 0;
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
  const [ingredients, setIngredients] = useState<UIMealRecipeIngredient[]>([]);
  const [preparation, setPreparation] = useState<string>('');
  const [preparationTime, setPreparationTime] = useState<number>(DEFAULT_PREPARATION_TIME_VALUE);
  const [favorite, setFavorite] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onNameInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const onPreparationInputChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setPreparation(event.target.value);
  };

  const onPreparationTimeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPreparationTime(Number(event.target.value));
  };

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
        break;
      }
      case FormState.Step2_Ingredients: {
        nameValid = isNameValid(name);
        ingredientsValid = isIngredientsValid(ingredients);
        preparationValid = true;
        preparationTimeValid = true;
        break;
      }
      case FormState.Step3_Preparation: {
        nameValid = isNameValid(name);
        ingredientsValid = isIngredientsValid(ingredients);
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
      setIngredients(props.existingItem.ingredients);
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
      setIsValidated(false);
    } else {
      onCloseFormHandler();
    }
  };

  const onNextHandler = (): void => {
    if (formState < FormState.Step3_Preparation) {
      const isValid = validateFormStep();
      if (isValid) {
        setFormState(formState + 1);
        setIsValidated(false);
      }
    } else {
      onAddItemHandler();
    }
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onNextHandler();
  };

  const onAddIngredientHandler = (newIngredient: UIMealRecipeIngredient): void => {
    const currentIngredients = ingredients
      .slice()
      .filter(
        (x) => x.ingredient !== newIngredient.ingredient || x.variation !== newIngredient.variation,
      );
    currentIngredients.push(newIngredient);
    setIngredients(currentIngredients);
  };

  const onIngredientRemoveHandler = (item: UIMealRecipeIngredient): void => {
    console.log('clicked', item);
    const currentIngredients = ingredients
      .slice()
      .filter((x) => x.ingredient !== item.ingredient || x.variation !== item.variation);
    setIngredients(currentIngredients);
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
              feedbackMsg={FEEDBACK_MESSAGES.Name}
            />
          </CCol>
        </CRow>
        {formState === FormState.Step2_Ingredients && (
          <Fragment>
            <CRow className="mt-4">
              <CCol sm={12} md={6} style={{ borderRight: '1px dashed gray' }}>
                <CRow>
                  <CCol sm={12}>Ingredients:</CCol>
                </CRow>
                <CRow>
                  <CCol sm={12}>
                    <hr />
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol sm={12}>
                    {ingredients.length === 0 && isValidated && (
                      <FormElementFeedback feedbackMsg={FEEDBACK_MESSAGES.Ingredients} />
                    )}
                    {ingredients.length > 0 && (
                      <div>
                        <ul style={{ listStyle: 'none', padding: '0' }}>
                          {ingredients.map((x, index) => (
                            <li
                              key={index}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 0',
                              }}
                            >
                              <label key={index}>
                                {MealRecipesService.getInstance().printMealRecipeIngredient(x)}
                              </label>
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                size="lg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onIngredientRemoveHandler(x);
                                }}
                                style={{ cursor: 'pointer', marginLeft: 'auto' }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={12} md={6}>
                <AddMealRecipeIngredient onAddIngredientHandler={onAddIngredientHandler} />
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
