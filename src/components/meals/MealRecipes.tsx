import React, { Fragment, useState } from 'react';

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

//import WeightMeasurementDetailsForm from 'src/views/weight/WeightMeasurementDetailsForm';
//import DeleteWeightMeasurementForm from 'src/views/weight/DeleteWeightMeasurementForm';
//import { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';
import AddEditMealRecipeForm from 'src/views/meals/AddEditMealRecipeForm';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';

interface Props {
  title: string;
  items: UIMealRecipe[];
  showDeleteButton: boolean;
}

const MealRecipes: React.FC<Props> = (props) => {
  const [addEditRecipeModalVisible, setAddEditRecipeModalVisibility] = useState(false);
  //const [measurementDetailsModalVisible, setMeasurmentDetailsModalVisibility] = useState(false);
  //const [deleteMeasurementModalVisible, setDeleteMeasurementModalVisibility] = useState(false);
  const [currentItem, setCurrentItem] = useState<UIMealRecipe>();

  const openAddRecipeModalHandler = (): void => {
    setAddEditRecipeModalVisibility(true);
  };

  const closeAddEditRecipeFormHandler = (): void => {
    setAddEditRecipeModalVisibility(false);
    setCurrentItem(undefined);
  };

  const addOrEditRecipeHandler = (): void => {
    setAddEditRecipeModalVisibility(false);
    setCurrentItem(undefined);
  };

  /*const deleteMeasurementHandler = (): void => {
    setDeleteMeasurementModalVisibility(false);
  };

  const closeMeasurementDetailsModalHandler = (): void => {
    setMeasurmentDetailsModalVisibility(false);
  };

  const closeDeleteMeasurementModalHandler = (): void => {
    setDeleteMeasurementModalVisibility(false);
  };*/

  const onRowClickHandler = (id: string): void => {
    console.log('clicked');
    console.log(id);
  };

  return (
    <Fragment>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>{props.title} </CCardHeader>

            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Recipe</CTableHeaderCell>
                    <CTableHeaderCell>Preparation time</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {props.items.map((item: UIMealRecipe, index: number) => (
                    <CTableRow
                      v-for="item in tableItems"
                      key={index}
                      onClick={onRowClickHandler.bind(null, item.recipeId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.preparationTime} min</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
            <CCardFooter>
              <CButton color="secondary" className="float-end" onClick={openAddRecipeModalHandler}>
                <CIcon icon={cilPencil} /> Add Recipe
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <AddEditMealRecipeForm
        visible={addEditRecipeModalVisible}
        existingItem={currentItem}
        onCloseHandler={closeAddEditRecipeFormHandler}
        onSaveHandler={addOrEditRecipeHandler}
      />
    </Fragment>
  );

  /*
  <WeightMeasurementDetailsForm
        measurement={currentMeasurement}
        visible={measurementDetailsModalVisible}
        onCloseHandler={closeMeasurementDetailsModalHandler}
      />
      <DeleteWeightMeasurementForm
        measurement={currentMeasurement}
        visible={deleteMeasurementModalVisible}
        onCloseHandler={closeDeleteMeasurementModalHandler}
        onDeleteHandler={deleteMeasurementHandler}
      />
      */
};

export default MealRecipes;
