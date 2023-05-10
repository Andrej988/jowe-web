import React, { Fragment, useEffect, useState } from 'react';

import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import { toFormattedDateString } from '../../services/utils/DateUtils';
import type { SimpleMeasurements } from 'src/model/weight/Measurements';

const TIMEFRAME_ALL = 'All';
const TIMEFRAME_YEAR = 'Year';
const TIMEFRAME_YTD = 'YTD';

const filterMeasurements = (
  measurements: SimpleMeasurements,
  timeframe: string,
): SimpleMeasurements => {
  if (timeframe === TIMEFRAME_ALL) {
    return measurements.slice();
  } else {
    const filterFromDate =
      timeframe === TIMEFRAME_YTD
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
  label: string;
  measurements: SimpleMeasurements;
}

const WeightMeasurementChart: React.FC<Props> = (props) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAME_ALL);
  const [measurements, setMeasurements] = useState(props.measurements);

  const onTimeframeChangeHandler = (value: string): void => {
    setTimeframe(value);
  };

  useEffect(() => {
    const newMeasurements = filterMeasurements(props.measurements, timeframe);
    setMeasurements(newMeasurements);
  }, [props.measurements, timeframe]);

  return (
    <Fragment>
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
              <CButtonGroup className="float-end me-3">
                {[TIMEFRAME_YTD, TIMEFRAME_YEAR, TIMEFRAME_ALL].map((value) => (
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
                  label: props.label,
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointBackgroundColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: measurements.map((x) => x.measurement),
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
      </CCard>
    </Fragment>
  );
};

export default WeightMeasurementChart;
