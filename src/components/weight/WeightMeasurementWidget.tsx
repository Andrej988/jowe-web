import React from 'react';
import { CCol, CWidgetStatsA } from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';
import { toFormattedDateString } from '../../services/utils/DateUtils';
import type { SimpleMeasurements } from 'src/model/Measurement';

interface Props {
  title: string;
  color: string;
  unit?: string;
  pointStyle: string;
  measurements: SimpleMeasurements;
}

const WeightMeasurementWidget: React.FC<Props> = (props) => {
  const measurementsSortedByDate = props.measurements.slice();
  const latestMeasurement = measurementsSortedByDate[measurementsSortedByDate.length - 1];
  const secondToLastMeasurement = measurementsSortedByDate[measurementsSortedByDate.length - 2];

  const diffPercentage =
    Math.round(
      ((1 - latestMeasurement.measurement / secondToLastMeasurement.measurement) * -100 +
        Number.EPSILON) *
        100,
    ) / 100;

  return (
    <CCol sm={6} lg={3}>
      <CWidgetStatsA
        className="mb-4"
        color={props.color}
        value={
          <>
            {latestMeasurement.measurement} {props.unit}{' '}
            <span className="fs-6 fw-normal">
              ({diffPercentage}% <CIcon icon={diffPercentage < 0 ? cilArrowBottom : cilArrowTop} />)
            </span>
          </>
        }
        title={props.title}
        chart={
          <CChartLine
            className="mt-3"
            style={{ height: '70px' }}
            data={{
              labels: measurementsSortedByDate.map((x) => toFormattedDateString(x.date)),
              datasets: [
                {
                  label: props.title,
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: getStyle(props.pointStyle),
                  data: measurementsSortedByDate.map((x) => x.measurement),
                  fill: true,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                },
              },
              elements: {
                line: {
                  borderWidth: 2,
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }}
          />
        }
      />
    </CCol>
  );
};

export default WeightMeasurementWidget;
