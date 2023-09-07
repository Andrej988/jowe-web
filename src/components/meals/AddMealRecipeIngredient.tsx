import React, {
  type ChangeEvent,
  type PropsWithChildren,
  useState,
  useEffect,
  Fragment,
} from 'react';
import { CButton, CCol, CRow } from '@coreui/react';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { cilBasket, cilClock } from '@coreui/icons';
import { useSelector } from 'react-redux';
import { ReduxStoreState } from 'src/store/Store';
import { UIMealRecipeIngredient } from 'src/model/meals/UIMealsRecipes';
import FormSelectGroupWithFeedbackEnhanced, {
  ListOption,
} from 'src/components/utils/FormSelectGroupWithFeedbackEnhanced';
import { capitalizeFirstWord } from 'src/services/utils/StringUtils';

interface Props extends PropsWithChildren {
  onAddIngredientHandler: (ingredient: UIMealRecipeIngredient) => void;
}

interface FormValidityState {
  ingredientValid: boolean;
  variationValid: boolean;
  quantityUnitValid: boolean;
  quantityValid: boolean;
}

const USE_NORMAL_LABELS = true;
const DEFAULT_IS_VALIDATED = false;
const DEFAULT_FORM_VALIDITY_STATE: FormValidityState = {
  ingredientValid: false,
  variationValid: false,
  quantityUnitValid: false,
  quantityValid: false,
};
const DEFAULT_INGREDIENT_QUANTITY = 1;

enum IngredientsSubset {
  Variations,
  Quantities,
}

const AddMealRecipeIngredient: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState<boolean>(DEFAULT_IS_VALIDATED);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

  const ingredientsListValues = useSelector(
    (state: ReduxStoreState) => state.mealPlanner.ingredients,
  );

  const [selectedIngredient, setSelectedIngredient] = useState<ListOption | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<ListOption | null>(null);
  const [selectedQuantityUnit, setSelectedQuantityUnit] = useState<ListOption | null>(null);
  const [quantity, setQuantity] = useState<number>(DEFAULT_INGREDIENT_QUANTITY);

  const onSelectedIngredientChange = (option: ListOption | null) => {
    setSelectedIngredient(option);
    setSelectedVariation(null);
    setSelectedQuantityUnit(null);
    setQuantity(DEFAULT_INGREDIENT_QUANTITY);
    setIsValidated(false);
  };

  const onSelectedVariationChange = (option: ListOption | null) => {
    setSelectedVariation(option);
  };

  const onSelectedQuantityUnitChange = (option: ListOption | null) => {
    setSelectedQuantityUnit(option);
  };

  const onQuantityChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuantity(Number(event.target.value));
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

  const validateForm = (): boolean => {
    const ingredientValid = selectedIngredient !== null;
    const variationValid =
      selectedVariation !== null ||
      getSelectedIngredientOptions(IngredientsSubset.Variations).length === 0;
    const quantityUnitValid = selectedQuantityUnit !== null;
    const quantityValid = quantity > 0;

    setIsValidated(true);
    setFormValidityState({
      ingredientValid,
      variationValid,
      quantityUnitValid,
      quantityValid,
    });

    return ingredientValid && variationValid && quantityUnitValid && quantityValid;
  };

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
  }, [selectedIngredient, selectedVariation, selectedQuantityUnit, quantity]);

  const onAddIngredientHandler = (): void => {
    if (validateForm()) {
      const ingredient: UIMealRecipeIngredient = {
        ingredient: selectedIngredient!.value,
        variation: selectedVariation?.value,
        quantity: quantity,
        quantityUnit: selectedQuantityUnit!.value,
      };
      props.onAddIngredientHandler(ingredient);
    }
  };

  return (
    <Fragment>
      <CRow>
        <CCol sm={12}>Add ingredient:</CCol>
      </CRow>
      <CRow>
        <CCol sm={12}>
          <hr />
        </CCol>
      </CRow>
      <CRow className="mt-2">
        <CCol sm={12}>
          <FormSelectGroupWithFeedbackEnhanced
            icon={cilBasket}
            id="ingredients-select"
            label="Ingredient"
            value={selectedIngredient}
            setValue={setSelectedIngredient}
            onChange={onSelectedIngredientChange}
            placeholder="Select ingredient..."
            options={ingredientsListValues.map((x) => {
              return {
                value: x.value,
                label: capitalizeFirstWord(x.value),
              };
            })}
            invalid={isValidated && !formValidtyState.ingredientValid}
            feedbackMsg="Please select ingredient..."
          />
        </CCol>
      </CRow>
      <CRow className="mt-2">
        <CCol sm={12}>
          <FormSelectGroupWithFeedbackEnhanced
            icon={cilBasket}
            id="variations-select"
            label="Variation"
            value={selectedVariation}
            setValue={setSelectedVariation}
            onChange={onSelectedVariationChange}
            placeholder={
              getSelectedIngredientOptions(IngredientsSubset.Variations).length > 0
                ? 'Select variation...'
                : 'Variations not available'
            }
            options={getSelectedIngredientOptions(IngredientsSubset.Variations)}
            invalid={isValidated && !formValidtyState.variationValid}
            feedbackMsg="Please select variation..."
          />
        </CCol>
      </CRow>
      <CRow className="mt-2">
        <CCol sm={12}>
          <FormSelectGroupWithFeedbackEnhanced
            icon={cilBasket}
            id="quantities-select"
            label="Quantity Unit"
            value={selectedQuantityUnit}
            setValue={setSelectedQuantityUnit}
            onChange={onSelectedQuantityUnitChange}
            placeholder={
              getSelectedIngredientOptions(IngredientsSubset.Quantities).length > 0
                ? 'Select quantity...'
                : 'Quantities not available'
            }
            className="mt-2"
            options={getSelectedIngredientOptions(IngredientsSubset.Quantities)}
            invalid={isValidated && !formValidtyState.quantityUnitValid}
            feedbackMsg="Please select quantity..."
          />
        </CCol>
      </CRow>
      <CRow className="mt-2 mb-5">
        <CCol sm={12}>
          <FormInputGroupWithFeedback
            className="mt-2"
            id="quantity"
            icon={cilClock}
            type="number"
            label="Quantity"
            normalLabel={USE_NORMAL_LABELS}
            autoComplete="quantity"
            pattern="[0-9]*"
            value={quantity}
            onChange={onQuantityChange}
            invalid={isValidated && !formValidtyState.quantityValid}
            feedbackMsg="Please select quantity..."
          />
        </CCol>
      </CRow>

      <CRow className="mt-5 mb-5 justify-content-end">
        <CCol sm={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CButton variant="outline" color="secondary" onClick={onAddIngredientHandler}>
            Add ingredient
          </CButton>
        </CCol>
      </CRow>
    </Fragment>
  );
};

export default AddMealRecipeIngredient;
