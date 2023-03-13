import React from 'react';

import {
  CCard,
  CCardBody,
  CCardHeader,
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
import { cilBalanceScale, cilInfo, cilTrash } from '@coreui/icons';

import { getLocalDateString } from '../../utils/DateUtils';
import { Measurement } from 'src/model/Measurement';

interface Props {
  measurements: Measurement[];
}

const MeasurementHistory: React.FC<Props> = (props) => {
  const onInfoHandler = (id: string) => {
    console.log('info clicked for id', id);
    //TODO: Implement
  };

  const onDeleteHandler = (id: string) => {
    console.log('delete clicked for id', id);
    //TODO: Implement
  };

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>History of Measurements</CCardHeader>
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
                    <CTableHeaderCell className="text-center">Water</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Muscle Mass</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Bone</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Energy Expenditure</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Notes</CTableHeaderCell>
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
                          key={'info_' + index}
                          onClick={onInfoHandler.bind(null, item.measurementId)}
                        >
                          <CIcon icon={cilInfo} />
                        </CButton>{' '}
                        <CButton
                          color="danger"
                          key={'delete_' + index}
                          onClick={onDeleteHandler.bind(null, item.measurementId)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default MeasurementHistory;
