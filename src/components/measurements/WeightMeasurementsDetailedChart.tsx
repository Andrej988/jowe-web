import React, { useEffect, useState } from 'react';

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
  CDropdownMenu,
} from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import { toFormattedDateString } from '../../utils/DateUtils';
import type { SimpleMeasurements } from 'src/model/Measurement';
import styles from './WeightMeasurementsDetailedChart.module.css';
import AddMeasurementForm from 'src/views/measurements/AddMeasurementForm';
import SetTargetWeightForm from 'src/views/measurements/SetTargetWeightForm';

const filterMeasurements = (
  measurements: SimpleMeasurements,
  timeframe: string,
): SimpleMeasurements => {
  if (timeframe === 'All') {
    return measurements.slice();
  } else {
    const filterFromDate =
      timeframe === 'YTD'
        ? new Date(new Date().getFullYear(), 0, 1)
        : new Date(new Date().setFullYear(new Date().getFullYear() - 1));

    return measurements.slice().filter((x) => {
      return x.date >= filterFromDate;
    });
  }
};

interface Props {
  title: string;
  subtitle?: string;
  measurements: SimpleMeasurements;
  targetWeight: number;
}

const WeightMeasurementsDetailedChart: React.FC<Props> = (props) => {
  const [timeframe, setTimeframe] = useState('All');
  const [measurements, setMeasurements] = useState(props.measurements);
  const [addMeasurementsModalVisible, setAddMeasurementsModalVisibility] = useState(false);
  const [targetWeightModalVisible, setTargetWeightModalVisibility] = useState(false);

  const latestMeasurement = props.measurements[props.measurements.length - 1];
  const latestWeight = latestMeasurement.measurement;
  const targetWeight = props.targetWeight;
  const targetArr = Array(props.measurements.length).fill(props.targetWeight);
  const targetDiff = Math.round((1 - latestWeight / targetWeight) * -100 * 100) / 100;
  const targetReach = Math.round((targetWeight - latestWeight) * 100) / 100;

  const openAddMeasurementModal = (): void => {
    console.log('Add Measurement clicked');
    setAddMeasurementsModalVisibility(true);
  };

  const closeAddMeasurementForm = (): void => {
    setAddMeasurementsModalVisibility(false);
  };

  const addMeasurement = (): void => {
    console.log('adding measurement');
    // TODO: Implement
    setAddMeasurementsModalVisibility(false);
  };

  const openSetTargetWeightModal = (): void => {
    console.log('Set Target Weight clicked');
    setTargetWeightModalVisibility(true);
  };

  const closeSetTargetWeightForm = (): void => {
    setTargetWeightModalVisibility(false);
  };

  const setTargetWeight = (): void => {
    console.log('setting target weight');
    // TODO: Implement
    setTargetWeightModalVisibility(false);
  };

  const onTimeframeChangeHandler = (value: string): void => {
    setTimeframe(value);
  };

  useEffect(() => {
    const newMeasurements = filterMeasurements(props.measurements, timeframe);
    setMeasurements(newMeasurements);
  }, [props.measurements, timeframe]);

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                {props.title}
              </h4>
              <div className="small text-medium-emphasis">
                {props.subtitle !== null ? props.subtitle : ''}
              </div>
            </CCol>
            <CCol sm={7} className="float-end">
              <CDropdown dark className="float-end">
                <CDropdownToggle color="dark">Actions</CDropdownToggle>
                <CDropdownMenu>
                  <div className={styles['dropdown-item']}>
                    <CDropdownItem onClick={openAddMeasurementModal}>Add Measurement</CDropdownItem>
                  </div>
                  <div className={styles['dropdown-item']}>
                    <CDropdownItem onClick={openSetTargetWeightModal}>
                      Set Target Weight
                    </CDropdownItem>
                  </div>
                </CDropdownMenu>
              </CDropdown>

              <CButtonGroup className="float-end me-3">
                {['YTD', 'Year', 'All'].map((value) => (
                  <CButton
                    color="dark"
                    key={value}
                    className="mx-0"
                    active={value === timeframe}
                    onClick={onTimeframeChangeHandler.bind(null, value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: measurements.map((x) => toFormattedDateString(x.date)),
              datasets: [
                {
                  label: 'Actual weight',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointBackgroundColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: measurements.map((x) => x.measurement),
                },
                {
                  label: 'Target weight',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointBackgroundColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  pointRadius: 0,
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: targetArr,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    // beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    // max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 3,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
            <CCol className="mb-sm-2 mb-0" key={0}>
              <div className="text-medium-emphasis">Actual Weight</div>
              <strong>{latestWeight} kg</strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={1}>
              <div className="text-medium-emphasis">Target Weight</div>
              <strong>{targetWeight} kg</strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={2}>
              <div className="text-medium-emphasis">Target Diff</div>
              <strong>{targetDiff}%</strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={3}>
              <div className="text-medium-emphasis">Target to Reach</div>
              <strong>{targetReach} kg</strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={4}>
              <div className="text-medium-emphasis">Total Measurements</div>
              <strong>{props.measurements.length}</strong>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
      <AddMeasurementForm
        visible={addMeasurementsModalVisible}
        onCloseHandler={closeAddMeasurementForm}
        onSaveHandler={addMeasurement}
      />
      <SetTargetWeightForm
        visible={targetWeightModalVisible}
        onCloseHandler={closeSetTargetWeightForm}
        onSaveHandler={setTargetWeight}
      />
    </>
  );
};

export default WeightMeasurementsDetailedChart;
