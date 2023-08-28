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
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo, cilPencil, cilTrash } from '@coreui/icons';

import AddEditMealRecipeForm from 'src/views/meals/AddEditMealRecipeForm';
import { UIMealRecipe } from 'src/model/meals/UIMealsRecipes';
import DeleteMealRecipeForm from 'src/views/meals/DeleteMealRecipeForm';
import MealRecipeDetailsForm from 'src/views/meals/MealRecipeDetailsForm';

interface Props {
  title: string;
  items: UIMealRecipe[];
  showDetailsButton: boolean;
  showEditButton: boolean;
  showDeleteButton: boolean;
}

const MealRecipes: React.FC<Props> = (props) => {
  const [addEditModalVisible, setAddEditModalVisibility] = useState(false);
  const [detailsModalVisible, setDetailsModalVisibility] = useState(false);
  const [deleteModalVisible, setDeleteModalVisibility] = useState(false);
  const [currentItem, setCurrentItem] = useState<UIMealRecipe>();

  const onInfoHandler = (id: string): void => {
    setCurrentItem(props.items.filter((x) => x.recipeId === id)[0]);
    setDetailsModalVisibility(true);
  };

  const onDeleteHandler = (id: string): void => {
    setCurrentItem(props.items.filter((x) => x.recipeId === id)[0]);
    setDeleteModalVisibility(true);
  };

  const openEditMeasurementModalHandler = (id: string): void => {
    setCurrentItem(props.items.filter((x) => x.recipeId === id)[0]);
    setAddEditModalVisibility(true);
  };

  const openAddRecipeModalHandler = (): void => {
    setAddEditModalVisibility(true);
  };

  const closeAddEditRecipeFormHandler = (): void => {
    setAddEditModalVisibility(false);
    setCurrentItem(undefined);
  };

  const addOrEditRecipeHandler = (): void => {
    setAddEditModalVisibility(false);
    setCurrentItem(undefined);
  };

  const deleteRecipeHandler = (): void => {
    setDeleteModalVisibility(false);
  };

  const closeDetailsModalHandler = (): void => {
    setDetailsModalVisibility(false);
  };

  const closeDeleteRecipeModalHandler = (): void => {
    setDeleteModalVisibility(false);
  };

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
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
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
                      <CTableDataCell className="text-center">
                        {props.showDetailsButton ? (
                          <CTooltip content="Show recipe" animation={false}>
                            <CButton
                              color="secondary"
                              variant="outline"
                              key={`info_ ${index}`}
                              onClick={onInfoHandler.bind(null, item.recipeId)}
                            >
                              <CIcon icon={cilInfo} />
                            </CButton>
                          </CTooltip>
                        ) : (
                          ''
                        )}{' '}
                        {props.showEditButton ? (
                          <CTooltip content="Edit recipe" animation={false}>
                            <CButton
                              color="secondary"
                              variant="outline"
                              key={`edit_ ${index}`}
                              onClick={openEditMeasurementModalHandler.bind(null, item.recipeId)}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTooltip>
                        ) : (
                          ''
                        )}{' '}
                        {props.showDeleteButton ? (
                          <CTooltip content="Delete recipe" animation={false}>
                            <CButton
                              color="danger"
                              variant="outline"
                              key={`delete_ ${index}`}
                              onClick={onDeleteHandler.bind(null, item.recipeId)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTooltip>
                        ) : (
                          ''
                        )}
                      </CTableDataCell>
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
        visible={addEditModalVisible}
        existingItem={currentItem}
        onCloseHandler={closeAddEditRecipeFormHandler}
        onSaveHandler={addOrEditRecipeHandler}
      />
      <MealRecipeDetailsForm
        item={currentItem}
        visible={detailsModalVisible}
        onCloseHandler={closeDetailsModalHandler}
      />
      <DeleteMealRecipeForm
        recipe={currentItem}
        visible={deleteModalVisible}
        onCloseHandler={closeDeleteRecipeModalHandler}
        onDeleteHandler={deleteRecipeHandler}
      />
    </Fragment>
  );
};

export default MealRecipes;
