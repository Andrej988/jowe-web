import React, { Fragment, useEffect, useState } from 'react';

import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle, hexToRgba } from '@coreui/utils';
import { toFormattedDateString } from '../../utils/DateUtils';
import { SimpleMeasurements } from 'src/model/Measurement';

const filterMeasurements = (measurements: SimpleMeasurements, timeframe: string) => {
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
  label: string;
  measurements: SimpleMeasurements;
}

const MeasurementChart: React.FC<Props> = (props) => {
  const [timeframe, setTimeframe] = useState('All');
  const [measurements, setMeasurements] = useState(props.measurements);

  const onTimeframeChangeHandler = (value: string) => {
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
                    //beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    //max: 250,
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

export default MeasurementChart;
