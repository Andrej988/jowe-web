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
import { cilPencil, cilBalanceScale, cilInfo, cilTrash } from '@coreui/icons';

import { getLocalDateString } from '../../services/utils/DateUtils';
import WeightMeasurementDetailsForm from 'src/views/weight/WeightMeasurementDetailsForm';
import DeleteWeightMeasurementForm from 'src/views/weight/DeleteWeightMeasurementForm';
import AddEditWeightMeasurementForm from 'src/views/weight/AddEditWeightMeasurementForm';
import { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';

interface Props {
  title: string;
  measurements: UIWeightMeasurement[];
  showDeleteButton: boolean;
}

const MEASUREMENT_NOT_AVAILABLE_STRING = '-';

const WeightMeasurementHistory: React.FC<Props> = (props) => {
  const [addEditMeasurementsModalVisible, setAddEditMeasurementsModalVisibility] = useState(false);
  const [measurementDetailsModalVisible, setMeasurmentDetailsModalVisibility] = useState(false);
  const [deleteMeasurementModalVisible, setDeleteMeasurementModalVisibility] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState<UIWeightMeasurement>();

  const onInfoHandler = (id: string): void => {
    setCurrentMeasurement(props.measurements.filter((x) => x.measurementId === id)[0]);
    setMeasurmentDetailsModalVisibility(true);
  };

  const onDeleteHandler = (id: string): void => {
    setCurrentMeasurement(props.measurements.filter((x) => x.measurementId === id)[0]);
    setDeleteMeasurementModalVisibility(true);
  };

  const openEditMeasurementModalHandler = (id: string): void => {
    setCurrentMeasurement(props.measurements.filter((x) => x.measurementId === id)[0]);
    setAddEditMeasurementsModalVisibility(true);
  };

  const openAddMeasurementModalHandler = (): void => {
    setAddEditMeasurementsModalVisibility(true);
  };

  const closeAddEditMeasurementFormHandler = (): void => {
    setAddEditMeasurementsModalVisibility(false);
    setCurrentMeasurement(undefined);
  };

  const addOrEditMeasurementHandler = (): void => {
    setAddEditMeasurementsModalVisibility(false);
    setCurrentMeasurement(undefined);
  };

  const deleteMeasurementHandler = (): void => {
    setDeleteMeasurementModalVisibility(false);
  };

  const closeMeasurementDetailsModalHandler = (): void => {
    setMeasurmentDetailsModalVisibility(false);
  };

  const closeDeleteMeasurementModalHandler = (): void => {
    setDeleteMeasurementModalVisibility(false);
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
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilBalanceScale} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Time</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Weight</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Body Fat</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Body Water</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Muscle Mass</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Bone Mass</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Energy Expenditure</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {props.measurements.map((item: UIWeightMeasurement, index: number) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center"></CTableDataCell>
                      <CTableDataCell>{getLocalDateString(item.date)}</CTableDataCell>
                      <CTableDataCell>
                        {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.weight !== undefined
                          ? `${item.measurements.weight} kg`
                          : MEASUREMENT_NOT_AVAILABLE_STRING}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.bodyFatPercentage !== undefined
                          ? `${item.measurements.bodyFatPercentage} %`
                          : MEASUREMENT_NOT_AVAILABLE_STRING}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.waterPercentage !== undefined
                          ? `${item.measurements.waterPercentage} %`
                          : MEASUREMENT_NOT_AVAILABLE_STRING}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.muscleMassPercentage !== undefined
                          ? `${item.measurements.muscleMassPercentage} %`
                          : MEASUREMENT_NOT_AVAILABLE_STRING}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.bonePercentage !== undefined
                          ? `${item.measurements.bonePercentage} %`
                          : MEASUREMENT_NOT_AVAILABLE_STRING}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.energyExpenditure !== undefined
                          ? `${item.measurements.energyExpenditure} kcal`
                          : MEASUREMENT_NOT_AVAILABLE_STRING}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CTooltip content="Details of measurement" animation={false}>
                          <CButton
                            color="secondary"
                            variant="outline"
                            key={`info_ ${index}`}
                            onClick={onInfoHandler.bind(null, item.measurementId)}
                          >
                            <CIcon icon={cilInfo} />
                          </CButton>
                        </CTooltip>{' '}
                        {props.showDeleteButton ? (
                          <CTooltip content="Edit measurement" animation={false}>
                            <CButton
                              color="secondary"
                              variant="outline"
                              key={`edit_ ${index}`}
                              onClick={openEditMeasurementModalHandler.bind(
                                null,
                                item.measurementId,
                              )}
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                          </CTooltip>
                        ) : (
                          ''
                        )}{' '}
                        {props.showDeleteButton ? (
                          <CTooltip content="Delete measurement" animation={false}>
                            <CButton
                              color="danger"
                              variant="outline"
                              key={`delete_ ${index}`}
                              onClick={onDeleteHandler.bind(null, item.measurementId)}
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
              <CButton
                color="secondary"
                className="float-end"
                onClick={openAddMeasurementModalHandler}
              >
                <CIcon icon={cilPencil} /> Add Measurement
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <AddEditWeightMeasurementForm
        visible={addEditMeasurementsModalVisible}
        existingItem={currentMeasurement}
        onCloseHandler={closeAddEditMeasurementFormHandler}
        onSaveHandler={addOrEditMeasurementHandler}
      />
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
    </Fragment>
  );
};

export default WeightMeasurementHistory;
