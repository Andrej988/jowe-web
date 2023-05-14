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
import { toFormattedDateString } from '../../services/utils/DateUtils';
import type {
  Measurement,
  SimpleMeasurement,
  SimpleMeasurements,
} from 'src/model/weight/Measurements';
import styles from './WeightMeasurementsDetailedChart.module.css';
import AddMeasurementForm from 'src/views/weight/AddWeightMeasurementForm';
import SetTargetWeightForm from 'src/views/weight/SetTargetWeightForm';
import { useSelector } from 'react-redux';
import { type TargetWeight } from 'src/model/weight/TargetWeights';

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
}

const WeightMeasurementsDetailedChart: React.FC<Props> = (props) => {
  const measurementsRedux: Measurement[] = useSelector((state: any) => state.weight.measurements);
  const targetWeightsRedux: TargetWeight[] = useSelector(
    (state: any) => state.weight.targetWeights,
  );

  const [timeframe, setTimeframe] = useState('All');
  const [measurements, setMeasurements] = useState<SimpleMeasurements>([]);
  const [addMeasurementsModalVisible, setAddMeasurementsModalVisibility] = useState(false);
  const [targetWeightModalVisible, setTargetWeightModalVisibility] = useState(false);

  const [latestMeasurement, setLatestMeasurement] = useState<SimpleMeasurement | undefined>(
    undefined,
  );
  const [targetWeight, setTargetWeight] = useState<number>(0);

  const latestWeight = latestMeasurement !== undefined ? latestMeasurement.measurement : 0;
  const targetDiff = Math.round((1 - latestWeight / targetWeight) * -100 * 100) / 100;
  const targetReach = Math.round((targetWeight - latestWeight) * 100) / 100;

  useEffect(() => {
    const sortedMeasurements: Measurement[] =
      measurementsRedux.length > 0
        ? measurementsRedux.slice().sort((a: any, b: any) => a.date - b.date)
        : measurementsRedux;

    const sortedSimpleMeasurements = sortedMeasurements.slice().map((x) => {
      return {
        id: x.measurementId,
        date: x.date,
        measurement: x.measurements.weight,
      };
    });

    const sortedAndFilteredMeasurements = filterMeasurements(sortedSimpleMeasurements, timeframe);

    setMeasurements(sortedAndFilteredMeasurements);
    setLatestMeasurement(sortedSimpleMeasurements[sortedSimpleMeasurements.length - 1]);
  }, [measurementsRedux, timeframe]);

  useEffect(() => {
    let target = 0;
    if (targetWeightsRedux.length > 0) {
      const latestTargetWeight = targetWeightsRedux.reduce((a, b) => {
        return a.timestamp > b.timestamp ? a : b;
      });
      target = latestTargetWeight.targetWeight;
    }
    setTargetWeight(target);
  }, [targetWeightsRedux]);

  const openAddMeasurementModal = (): void => {
    setAddMeasurementsModalVisibility(true);
  };

  const closeAddMeasurementForm = (): void => {
    setAddMeasurementsModalVisibility(false);
  };

  const addMeasurement = (): void => {
    setAddMeasurementsModalVisibility(false);
  };

  const openSetTargetWeightModal = (): void => {
    setTargetWeightModalVisibility(true);
  };

  const closeSetTargetWeightForm = (): void => {
    setTargetWeightModalVisibility(false);
  };

  const setTargetWeightHandler = (): void => {
    setTargetWeightModalVisibility(false);
  };

  const onTimeframeChangeHandler = (value: string): void => {
    setTimeframe(value);
  };

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
              <CDropdown dark className="float-end" popper={false} alignment="end">
                <CDropdownToggle color="secondary">Actions</CDropdownToggle>
                <CDropdownMenu style={{ right: '0', left: 'auto' }}>
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
                    color="secondary"
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
                  data: Array(measurements.length).fill(targetWeight),
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
              <strong>{measurements.length > 0 ? `${latestWeight} kg` : '-'}</strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={1}>
              <div className="text-medium-emphasis">Target Weight</div>
              <strong>{targetWeightsRedux.length > 0 ? `${targetWeight} kg` : '-'}</strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={2}>
              <div className="text-medium-emphasis">Target Diff</div>
              <strong>
                {measurements.length > 0 && targetWeightsRedux.length > 0 ? `${targetDiff}%` : '-'}
              </strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={3}>
              <div className="text-medium-emphasis">Target to Reach</div>
              <strong>
                {measurements.length > 0 && targetWeightsRedux.length > 0
                  ? `${targetReach} kg`
                  : '-'}
              </strong>
            </CCol>
            <CCol className="mb-sm-2 mb-0" key={4}>
              <div className="text-medium-emphasis">Total Measurements</div>
              <strong>{measurements.length}</strong>
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
        onSaveHandler={setTargetWeightHandler}
      />
    </>
  );
};

export default WeightMeasurementsDetailedChart;
