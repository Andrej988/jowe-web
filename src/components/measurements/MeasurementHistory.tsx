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
import { cilPencil, cilBalanceScale, cilInfo, cilTrash } from '@coreui/icons';

import { getLocalDateString } from '../../utils/DateUtils';
import type { Measurement } from 'src/model/Measurement';
import AddMeasurementForm from 'src/views/measurements/AddMeasurementForm';
import MeasurementDetailsForm from 'src/views/measurements/MeasurementDetailsForm';
import DeleteMeasurementForm from 'src/views/measurements/DeleteMeasurementForm';

interface Props {
  title: string;
  measurements: Measurement[];
  showDeleteButton: boolean;
}

const MeasurementHistory: React.FC<Props> = (props) => {
  const [addMeasurementsModalVisible, setAddMeasurementsModalVisibility] = useState(false);
  const [measurementDetailsModalVisible, setMeasurmentDetailsModalVisibility] = useState(false);
  const [deleteMeasurementModalVisible, setDeleteMeasurementModalVisibility] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState<Measurement>();

  const onInfoHandler = (id: string): void => {
    setCurrentMeasurement(props.measurements.filter((x) => x.measurementId === id)[0]);
    setMeasurmentDetailsModalVisibility(true);
  };

  const onDeleteHandler = (id: string): void => {
    setCurrentMeasurement(props.measurements.filter((x) => x.measurementId === id)[0]);
    setDeleteMeasurementModalVisibility(true);
  };

  const openAddMeasurementModalHandler = (): void => {
    setAddMeasurementsModalVisibility(true);
  };

  const closeAddMeasurementFormHandler = (): void => {
    setAddMeasurementsModalVisibility(false);
  };

  const addMeasurementHandler = (): void => {
    console.log('adding measurement');
    // TODO: Implement
    setAddMeasurementsModalVisibility(false);
  };

  const deleteMeasurementHandler = (): void => {
    console.log('deleting a measurement');
    console.log('current measurement id', currentMeasurement?.measurementId);
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
                  {props.measurements.map((item: Measurement, index: number) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center"></CTableDataCell>
                      <CTableDataCell>{getLocalDateString(item.date)}</CTableDataCell>
                      <CTableDataCell>
                        {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.weight} kg
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.bodyFatPercentage} %
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.waterPercentage} %
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.muscleMassPercentage} %
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.bonePercentage} %
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {item.measurements.energyExpenditure} kcal
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="dark"
                          variant="outline"
                          key={`info_ ${index}`}
                          onClick={onInfoHandler.bind(null, item.measurementId)}
                        >
                          <CIcon icon={cilInfo} />
                        </CButton>{' '}
                        {props.showDeleteButton ? (
                          <CButton
                            color="danger"
                            variant="outline"
                            key={`delete_ ${index}`}
                            onClick={onDeleteHandler.bind(null, item.measurementId)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
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
              <CButton color="dark" className="float-end" onClick={openAddMeasurementModalHandler}>
                <CIcon icon={cilPencil} /> Add Measurement
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <AddMeasurementForm
        visible={addMeasurementsModalVisible}
        onCloseHandler={closeAddMeasurementFormHandler}
        onSaveHandler={addMeasurementHandler}
      />
      <MeasurementDetailsForm
        measurement={currentMeasurement}
        visible={measurementDetailsModalVisible}
        onCloseHandler={closeMeasurementDetailsModalHandler}
      />
      <DeleteMeasurementForm
        measurement={currentMeasurement}
        visible={deleteMeasurementModalVisible}
        onCloseHandler={closeDeleteMeasurementModalHandler}
        onDeleteHandler={deleteMeasurementHandler}
      />
    </Fragment>
  );
};

export default MeasurementHistory;
